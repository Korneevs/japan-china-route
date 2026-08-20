import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
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
}

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
