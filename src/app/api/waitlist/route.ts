import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Geçerli bir email adresi girin.' }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      // Send notification to admin
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AklıSıra Waitlist <info@aklisira.com>',
          to: ['info@aklisira.com'],
          subject: `🎉 Yeni Waitlist Kaydı: ${email}`,
          html: `
            <div style="font-family: sans-serif; padding: 24px;">
              <h2 style="color: #0d6e64;">Yeni Waitlist Kaydı!</h2>
              <p><strong>Email:</strong> ${email}</p>
              ${name ? `<p><strong>Ad:</strong> ${name}</p>` : ''}
              <p style="color: #666; font-size: 0.85rem;">Tarih: ${new Date().toLocaleString('tr-TR')}</p>
            </div>
          `,
        }),
      });

      // Send welcome email to user
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AklıSıra <info@aklisira.com>',
          to: [email],
          subject: 'AklıSıra\'ya hoşgeldiniz! 🎓',
          html: `
            <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #0d6e64; font-size: 2rem; margin: 0;">AklıSıra</h1>
                <p style="color: #57534e; font-size: 0.9rem; margin-top: 4px;">Öğretmenin Asistanı. Sınıfın Beyni.</p>
              </div>
              
              <h2 style="color: #1a1715;">Listeye eklendiniz! 🎉</h2>
              <p style="color: #57534e; line-height: 1.7;">
                Merhaba${name ? ` ${name}` : ''},
              </p>
              <p style="color: #57534e; line-height: 1.7;">
                AklıSıra erken erişim listesine kaydınız alındı. Pro özellikler hazır olduğunda sizi ilk haberdar edeceğiz.
              </p>
              
              <div style="background: #f0ece7; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0; font-weight: 700; color: #1a1715;">Şu an yapabilecekleriniz:</p>
                <ul style="color: #57534e; line-height: 2; margin: 8px 0 0;">
                  <li>Demo sürümünü kullanın <a href="https://aklisira.com/app" style="color: #0d6e64;">aklisira.com/app</a></li>
                  <li>5 öğrenciye kadar ücretsiz oturma düzeni oluşturun</li>
                  <li>Kelebek sınav modunu deneyin</li>
                </ul>
              </div>
              
              <a href="https://aklisira.com/app" style="display: block; text-align: center; background: linear-gradient(135deg, #0d6e64, #14b8a6); color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 800; margin: 24px 0;">
                Hemen Dene →
              </a>
              
              <p style="color: #a8a29e; font-size: 0.8rem; text-align: center; margin-top: 32px;">
                AklıSıra · Baykar Fen Lisesi · info@aklisira.com
              </p>
            </div>
          `,
        }),
      });
    }

    // Log to console in serverless (Vercel logs)
    console.log(`[WAITLIST] ${new Date().toISOString()} — ${email}${name ? ` (${name})` : ''}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[WAITLIST ERROR]', err);
    return NextResponse.json({ error: 'Bir hata oluştu, tekrar deneyin.' }, { status: 500 });
  }
}
