import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <meta name="description" content="IT/CS/SE Стажировки в Казахстане" />
          <meta property="og:title" content="Казахстан IT Стажировки" />
          <meta
            property="og:description"
            content="IT/CS/SE Стажировки в Казахстане"
          />
          <meta property="og:url" content="https://tagylymdama.vercel.app/" />
          <meta property="og:type" content="website" />
        </Head>
        <body className="bg-white dark:bg-black scroll-smooth">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
