import Navbar from "@/components/Navbar/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import ToastProvider from "@/components/ToastProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ImageVerse",
  description: "ImageVerse app build with NextJS",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <Navbar />
          <div className="body">
            {children}
          </div>
          {modal}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
