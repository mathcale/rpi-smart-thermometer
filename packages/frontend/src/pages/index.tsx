import Head from 'next/head';
import Image from 'next/image';
import dayjs from 'dayjs';

import type { GetServerSideProps } from 'next/types';

import { ApiError } from '../dto/api-error.output';
import { FindAllTemperaturesOutput } from '../dto/find-all-temperatures.output';

import IconImage from '../../public/icon.png';

interface IndexPageProps {
  findAllTemperaturesResponse?: FindAllTemperaturesOutput;
  apiError?: ApiError;
}

export default function IndexPage({ findAllTemperaturesResponse, apiError }: IndexPageProps) {
  return (
    <>
      <Head>
        <title>Smart Thermometer</title>
      </Head>

      <main className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-center">
          <Image src={IconImage} width={120} height={120} alt="Application icon" />
          <h1 className="text-4xl md:text-6xl font-bold text-center mt-5">Smart Thermometer</h1>
        </div>

        {apiError ? (
          <div className="alert alert-error shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>{apiError.error}</span>
            </div>
          </div>
        ) : (
          <>
            {findAllTemperaturesResponse.count > 0 && (
              <section className="my-10">
                <div className="flex flex-wrap items-center justify-center">
                  <div className="card w-96 bg-base-300 shadow-xl mr-0 mb-5 md:mr-5 md:mb-0">
                    <div className="card-body">
                      <h2 className="card-title">Temperature</h2>
                      <p className="text-lg">
                        {findAllTemperaturesResponse.data[0].temperature.toFixed(1)}°C
                      </p>
                    </div>
                  </div>

                  <div className="card w-96 bg-base-300 shadow-xl mr-0 mb-5 md:mr-5 md:mb-0">
                    <div className="card-body">
                      <h2 className="card-title">Humidity</h2>
                      <p className="text-lg">
                        {findAllTemperaturesResponse.data[0].humidity.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="card w-96 bg-base-300 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Measured at</h2>
                      <p className="text-lg">
                        {dayjs(findAllTemperaturesResponse.data[0].measuredAt).format(
                          'DD/MM/YYYY HH:mm',
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold">Measurements log</h2>

              <div className="overflow-x-auto mt-5">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Temperature</th>
                      <th>Humidity</th>
                    </tr>
                  </thead>

                  <tbody>
                    {findAllTemperaturesResponse.data.map((temperature, i) => (
                      <tr key={i}>
                        <td>{dayjs(temperature.measuredAt).format('DD/MM/YYYY HH:mm')}</td>
                        <td>{temperature.temperature.toFixed(1)}°C</td>
                        <td>{temperature.humidity.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch(`${process.env.API_URL}/v1/temperatures`);
  const data: FindAllTemperaturesOutput = await response.json();

  if (!response.ok) {
    console.error('[ERROR] IndexPage.getServerSideProps:', data);

    return {
      props: {
        findAllTemperaturesResponse: null,
        apiError: 'There was an error while querying the temperatures, please try again later!',
      },
    };
  }

  return {
    props: {
      findAllTemperaturesResponse: data,
      apiError: null,
    },
  };
};
