import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'CyberFortress | Enterprise SOC',
  description: 'Next-Generation Managed Cybersecurity for SMEs',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-50 font-sans">
        
        <Providers>
          <Navbar />
          
          <main className="flex-grow">
            {children}
          </main>
          
          <Footer />
        </Providers>
        
      </body>
    </html>
  );
}