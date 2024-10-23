import "./globals.css";
import Provider from './components/Provider'



export const metadata = {
  title: "DreamHaven",
  description: "Unlock the meaning behind your dreams.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
      <body>{children}
      <script src="https://kit.fontawesome.com/de9455874d.js" crossOrigin="anonymous"></script>
      </body>
      </Provider>
      
    </html>
  );
}
