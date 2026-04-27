import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

export async function POST(req: NextRequest) {
  try {
    const { audioData } = await req.json();

    if (!audioData) {
      return NextResponse.json({ error: 'Ses verisi bulunamadı.' }, { status: 400 });
    }

    if (!process.env.FAL_KEY) {
      console.error('[TRANSCRIBE] FAL_KEY is missing from environment variables.');
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası (FAL_KEY eksik).' }, { status: 500 });
    }

    console.log('[TRANSCRIBE] Received audioData of length:', audioData.length);
    if (audioData.length < 100) {
      console.error('[TRANSCRIBE] Audio data is too small or empty!');
      return NextResponse.json({ error: 'Geçersiz veya boş ses verisi.' }, { status: 400 });
    }

    // Configure fal client with the API key from env
    fal.config({
      credentials: process.env.FAL_KEY,
    });

    console.log('[TRANSCRIBE] Uploading audio to fal storage...');
    
    // Parse the Data URI
    const match = audioData.match(/^data:(.*?);base64,(.*)$/);
    if (!match) {
      throw new Error('Geçersiz ses formatı.');
    }
    const contentType = match[1];
    const base64Str = match[2];
    const buffer = Buffer.from(base64Str, 'base64');
    const finalBlob = new Blob([buffer], { type: contentType });

    // Upload with explicit filename and content type so Whisper recognizes it as audio
    const uploadedUrl = await fal.storage.upload(finalBlob);
    
    console.log('[TRANSCRIBE] Uploaded to:', uploadedUrl);

    console.log('[TRANSCRIBE] Sending to fal-ai/whisper...');

    const result = await fal.subscribe('fal-ai/whisper', {
      input: {
        audio_url: uploadedUrl
      },
    });

    if (!result.data || !result.data.text) {
      throw new Error('Geçerli bir metin alınamadı.');
    }

    console.log('[TRANSCRIBE] Success. Text length:', result.data.text.length);

    return NextResponse.json({ text: result.data.text });
  } catch (err: any) {
    console.error('[TRANSCRIBE ERROR]', err);
    if (err.body) {
      console.error('[TRANSCRIBE ERROR BODY]', JSON.stringify(err.body, null, 2));
      return NextResponse.json({ 
        error: 'Ses işlenirken bir hata oluştu.', 
        details: err.body 
      }, { status: 500 });
    }
    return NextResponse.json({ error: 'Ses işlenirken bir hata oluştu.', details: err.message }, { status: 500 });
  }
}
