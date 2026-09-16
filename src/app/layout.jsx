import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata = {
  title: 'Joshua Adeoluwa — Author & Strategic Thinker | Books & Publications',
  description: 'Official bookstore and campaign library of Joshua Adeoluwa. Discover books on purpose, mental discipline, strategic leadership, and faith.',
  keywords: ['Joshua Adeoluwa', 'The Architecture of Purpose', 'Unshakable Focus', 'The Leader Crucible', 'Author', 'Books', 'Leadership', 'Purpose'],
  openGraph: {
    title: 'Joshua Adeoluwa — Author & Strategic Thinker',
    description: 'Stop wandering through life. Build what outlasts you. Official library of Joshua Adeoluwa.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} scroll-smooth`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-[#FBF9F5] text-[#0A0F1D]">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
