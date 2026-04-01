import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AklıSıra — Yapay Zeka Destekli Sınıf Düzeni Önerici",
  description:
    "Öğrenci özelliklerini dikkate alarak yapay zeka ile en uygun oturma düzenini oluşturun. Akademik denge, sosyal uyum ve davranış yönetimini aynı anda optimize edin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${nunito.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
