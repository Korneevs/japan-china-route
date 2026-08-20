import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const basePath = process.env.GITHUB_PAGES === "true" ? "/japan-china-route" : "";
const imageUrl = `${siteUrl}${basePath}/og.png`;

export const metadata: Metadata = {
  title: "Япония или Китай — два маршрута на 10 дней",
  description: "Токио, Киото и Осака против Шанхая, Чжанцзяцзе и Чунцина — маршруты, атмосфера и честные минусы.",
  openGraph: {
    title: "Япония или Китай?",
    description: "Два маршрута на 10 дней — с атмосферой, бонусами и честными минусами.",
    type: "website",
    images: [{ url: imageUrl, width: 800, height: 450, alt: "Япония или Китай — два маршрута на 10 дней" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Япония или Китай?",
    description: "Два маршрута на 10 дней — с атмосферой, бонусами и честными минусами.",
    images: [imageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
