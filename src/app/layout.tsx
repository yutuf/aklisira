import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AklıSıra — Yapay Zeka Destekli Sınıf Yönetim Platformu",
  description:
    "Öğretmenlerin kağıt ve Excel ile yaptığı sınıf yönetimini doğal dil + AI ile dakikalar içinde yapan platform. Oturma düzeni optimizasyonu, sınav modu, takım oluşturma — hepsi tek yerde.",
  keywords: [
    "sınıf oturma düzeni",
    "öğretmen asistanı",
    "eğitim yapay zeka",
    "sınıf yönetimi",
    "oturma planı",
    "yapay zeka öğretmen",
    "EdTech Türkiye",
    "öğrenci takip",
    "kelebek sistemi sınav",
    "AklıSıra",
  ],
  authors: [{ name: "AklıSıra", url: "https://aklisira.com" }],
  openGraph: {
    title: "AklıSıra — Öğretmenin Asistanı. Sınıfın Beyni.",
    description:
      "Kağıt, Excel ve hafıza ile yönetilen 30 öğrencinin kaosunu doğal dil + yapay zeka ile saniyeler içinde çözen platform.",
    url: "https://aklisira.com",
    siteName: "AklıSıra",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AklıSıra — Yapay Zeka Destekli Sınıf Yönetim Platformu",
    description:
      "Öğretmenler için oturma düzeni optimizasyonu, sınav modu ve takım oluşturma — hepsi tek yerde.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://aklisira.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className={`${nunito.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
