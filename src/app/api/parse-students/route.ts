import { NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Basit Memory-based IP Rate Limiter (Spam Koruması)
const ipCache = new Map<string, { count: number, resetAt: number }>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const rateData = ipCache.get(ip);
    
    if (rateData && now < rateData.resetAt) {
      if (rateData.count >= 15) { // 15 istek / dakika sınırı
        return NextResponse.json({ error: 'Çok fazla istek gönderdiniz. Lütfen 1 dakika bekleyin.' }, { status: 429 });
      }
      rateData.count++;
    } else {
      ipCache.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minute window
    }

    const { text } = await req.json();

    if (!text || text.trim().length < 5) {
      return NextResponse.json({ error: 'Lütfen geçerli bir metin girin.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API Key bulunamadı. Lütfen ayarlardan veya .env dosyasından tanımlayın.' },
        { status: 500 }
      );
    }

    const prompt = `
    Sen bir öğretmen asistanısın. Aşağıdaki serbest metni okuyarak öğrencilerin özelliklerini analiz et ve kesinlikle geçerli bir JSON dizisi (array) formatında döndür.
    JSON dışında hiçbir açıklama, markdown işareti (\`\`\`json vb.) KULLANMA. Doğrudan JSON döndür.

    Her bir öğrenci nesnesi şu alanları içermelidir:
    - "name": Öğrencinin adı (Sadece ilk harfi büyük).
    - "academicLevel": 'high', 'above_average', 'average', 'below_average', 'struggling' (Metne göre yorumla. Çalışkan/Zeki ise high, kötü ise struggling vs.)
    - "behaviorType": 'quiet', 'active', 'follower', 'leader', 'disruptive' (Konuşkan/Yaramaz ise disruptive, sessiz ise quiet vb.)
    - "movementNeeds": 'high', 'moderate', 'low', 'very_low' (Hareketli/DEHB ise high)
    - "specialNeeds": 'none', 'adhd', 'anxiety', 'vision', 'hearing'
    - "friends": Öğrencinin yan yana oturmak istediği veya uyumlu olduğu arkadaşlarının adları (Dizi olarak: ["Ayşe", "Mehmet"]). Yoksa boş dizi [].
    - "avoidStudents": Öğrencinin KESİNLİKLE YAN YANA OTURMAMASI GEREKEN, kavgalı olduğu veya konuşup dersi böldüğü kişilerin adları (Dizi olarak: ["Can", "Ali"]). Yoksa boş dizi [].
    - "visionNeeds": Gözlüklü veya tahtayı göremiyorsa 'front_required', yoksa 'none'
    - "hearingNeeds": Duyma sorunu varsa 'front_required', yoksa 'none'
    - "height": 'short', 'average', 'tall' (Boy bilgisi varsa)
    - "notes": Öğrenci hakkında belirtilen diğer tüm özel notlar. Metindeki ifadeleri özetleyerek yaz.

    Öğretmenin Notu:
    "${text}"
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      return NextResponse.json({ error: 'Yapay zeka servisi şu an yanıt veremiyor.' }, { status: 502 });
    }

    const data = await response.json();
    let jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    
    // Temizleme (Markdown blokları gelirse diye)
    jsonText = jsonText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();

    try {
      const parsedStudents = JSON.parse(jsonText);
      // Gelen datayı Student interface'ine uyarlamak için eksik id alanlarını ekleyelim
      const finalStudents = parsedStudents.map((s: any, idx: number) => ({
        ...s,
        id: `gemini-${Date.now()}-${idx}`,
        friends: s.friends || [],
        avoidStudents: s.avoidStudents || []
      }));
      return NextResponse.json({ students: finalStudents });
    } catch (parseError) {
      console.error("Parse Error:", jsonText);
      return NextResponse.json({ error: 'Yapay zeka formatında bir hata oluştu.' }, { status: 500 });
    }

  } catch (error) {
    console.error("Parse Students Route Error:", error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
