import Head from 'next/head';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Matheus Calegaro <hello@matheus.me>" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
