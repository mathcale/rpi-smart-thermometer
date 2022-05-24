import Head from 'next/head';

export default function Home({ getAllTemperaturesResponse }) {
  return (
    <>
      <Head>
        <title>Smart Thermometer</title>
      </Head>

      <div>
        <h1 className="text-6xl font-bold text-center">Smart Thermometer</h1>
        <pre>{JSON.stringify(getAllTemperaturesResponse, null, 2)}</pre>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`${process.env.BASE_URL}/api/temperatures`);
  const data = await response.json();

  if (!response.ok) {
    return {
      props: {
        getAllTemperaturesResponse: null,
        error: data.error,
      },
    };
  }

  return {
    props: {
      getAllTemperaturesResponse: data,
      error: null,
    },
  };
}
