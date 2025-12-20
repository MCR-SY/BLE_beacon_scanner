import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IFSEC India 2025 - Event Analytics Dashboard",
  description: "Stall & Exhibitor Analysis, Product & Zone Analysis, and Event Overview for IFSEC India 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                const fixPortal = function(portal) {
                  portal.style.setProperty('position', 'fixed', 'important');
                  portal.style.removeProperty('top');
                  portal.style.removeProperty('left');
                  portal.style.setProperty('z-index', '9999', 'important');
                };
                const fixAllPortals = function() {
                  const portals = document.querySelectorAll('nextjs-portal');
                  portals.forEach(fixPortal);
                };
                setTimeout(fixAllPortals, 0);
                setTimeout(fixAllPortals, 100);
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.nodeName === 'NEXTJS-PORTAL' || (node.nodeType === 1 && node.tagName === 'NEXTJS-PORTAL')) {
                        fixPortal(node);
                      }
                    });
                  });
                });
                observer.observe(document.body, { childList: true, subtree: true });
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
