import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycby9cd-x2fHd2ByHLdPOq9AhJPjp_3w1IdLx4gF9GnNBkfc_l1GD19qn0A7nYmgM-ZEy/exec';

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Geçerli bir email adresi girin.' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('[WAITLIST] Missing Supabase Env Vars:', { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey });
    }

    const supabase = createClient(supabaseUrl || '', supabaseKey || '');

    // ── 1. Supabase (primary) ──
    const { error: dbError } = await supabase
      .from('waitlist')
      .insert({ email, name: name || null });

    if (dbError) {
      if (dbError.code === '23505') {
        // Duplicate email — silently ok
        return NextResponse.json({ success: true });
      }
      console.error('[WAITLIST] Supabase error:', JSON.stringify(dbError));
    } else {
      console.log('[WAITLIST] Supabase insert OK');
    }

    // ── 2. Google Sheets (backup, fire-and-forget) ──
    fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: name || '', timestamp }),
    }).catch(err => console.error('[WAITLIST] Sheets error:', err));

    // ── 3. Resend welcome email (optional) ──
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'AklıSıra <info@aklisira.com>',
          to: [email],
          subject: "AklıSıra'ya hoşgeldiniz! 🎓",
          html: `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px">
            <h1 style="color:#0d6e64">AklıSıra</h1>
            <h2>Listeye eklendiniz! 🎉</h2>
            <p>İlk 50 kullanıcıya %50 indirim.</p>
            <a href="https://aklisira.com/app" style="display:block;text-align:center;background:linear-gradient(135deg,#0d6e64,#14b8a6);color:white;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:800;margin:24px 0">Demo'yu Dene →</a>
          </div>`,
        }),
      }).catch(err => console.error('[WAITLIST] Resend error:', err));
    }

    console.log(`[WAITLIST] ${timestamp} — ${email}${name ? ` (${name})` : ''}`);
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[WAITLIST ERROR]', err);
    return NextResponse.json({ error: 'Bir hata oluştu, tekrar deneyin.' }, { status: 500 });
  }
}
