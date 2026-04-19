import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script'
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google Analytics 4 */}
<Script
    id="google-analytics-4"
    src="https://www.googletagmanager.com/gtag/js?id=G-EFQC79NMSN"
    strategy="afterInteractive"
/>
              <Script
                  id="google-analytics-4-inline"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                      __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-EFQC79NMSN');`
                  }}
              />
{/* End Google Analytics 4 */}
<Component {...pageProps} />
      <Toaster />
    </>
  );
}
