import Head from 'next/head';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Matheus Calegaro <hello@matheus.me>" />
        <link rel="icon" type="image/png" href="/icon.png" />
      </Head>

      <Component {...pageProps} />

      <footer className="text-xs text-center my-10">
        <p>
          Made with ❤ by{' '}
          <a
            href="https://matheus.me"
            target="_blank"
            rel="noreferrer"
            referrerPolicy="no-referrer"
            className="underline font-bold"
          >
            Matheus Calegaro
          </a>
        </p>

        <a
          href="https://github.com/mathcale/rpi-smart-thermometer"
          target="_blank"
          rel="noreferrer"
          referrerPolicy="no-referrer"
          className="underline font-bold mt-1 inline-block"
        >
          Source code
        </a>
      </footer>
    </>
  );
}

export default MyApp;
