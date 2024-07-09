import Navbar from "@/components/Navbar/Navbar";
import "./globals.scss";
import Providers from "@/components/Providers";

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
    <html lang="en">
      <body>
        <Providers>
          <nav>
            <Navbar />
          </nav>
          {children}
          {modal}
        </Providers>
      </body>
    </html>
  );
}
