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

    // Configure fal client with the API key from env
    fal.config({
      credentials: process.env.FAL_KEY,
    });

    console.log('[TRANSCRIBE] Uploading audio to fal storage...');
    const audioBlob = await (await fetch(audioData)).blob();
    const uploadedUrl = await fal.storage.upload(audioBlob);
    console.log('[TRANSCRIBE] Uploaded to:', uploadedUrl);

    console.log('[TRANSCRIBE] Sending to fal-ai/whisper...');

    // In JS client, fal.storage.upload returns an object { url: string }
    const finalAudioUrl = typeof uploadedUrl === 'string' ? uploadedUrl : uploadedUrl.url;

    const result = await fal.subscribe('fal-ai/whisper', {
      input: {
        audio_url: finalAudioUrl,
        task: 'transcribe',
        language: 'tr',
        chunk_level: 'none'
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
    }
    return NextResponse.json({ error: 'Ses işlenirken bir hata oluştu.' }, { status: 500 });
  }
}
