import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* Google Analytics - Injection in Document to avoid Next.js Script tag attributes that AdSense dislikes */}
                <Script
                    id="ga-loader"
                    strategy="afterInteractive"
                    src="https://www.googletagmanager.com/gtag/js?id=G-L813ECJ9RR"
                />
                <Script id="ga-init" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-L813ECJ9RR');
                    `}
                </Script>

                {/* Google AdSense - Manual injection without data-nscript/data-next-head */}
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3419259043892692"
                    crossOrigin="anonymous"
                ></script>
                <Script
                    id="ads-ga-loader"
                    strategy="afterInteractive"
                    src="https://www.googletagmanager.com/gtag/js?id=AW-16779476999"
                />
                <Script id="ads-ga-init" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'AW-16779476999');
                    `}
                </Script>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
