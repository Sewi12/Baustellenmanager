import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baustellenmanager",
  description: "Persönlicher Baustellenmanager für Projekte, Pläne, Pins und Aufgaben."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body>{children}</body></html>;
}
