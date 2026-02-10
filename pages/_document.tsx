import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
<Head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/webp" href="/images/logo-optimized.webp" />
  <link rel="apple-touch-icon" href="/images/logo-optimized.webp" />
</Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
