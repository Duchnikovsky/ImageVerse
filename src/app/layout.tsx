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
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Navbar />
        <div className='body'>{children}</div>
        {authModal}
      </body>
    </html>
  );
}
