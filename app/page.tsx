import type { Metadata } from "next";
import TripExplorer from "./TripExplorer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Япония или Китай — два маршрута на 10 дней",
  description: "Визуальное сравнение маршрутов по Японии и Китаю: города, природа, атмосфера, бонусы и честные минусы.",
};

export default function Home() {
  return <TripExplorer />;
}
