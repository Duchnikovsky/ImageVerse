import Navbar from "@/components/Navbar";
import "./globals.css";
import { Inter, Nabla } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ImageVerse",
  description: "ImageVerse app build with NextJS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Navbar />
        <div>{children}</div>
      </body>
    </html>
  );
}
