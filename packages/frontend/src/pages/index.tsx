import Head from 'next/head';
import Image from 'next/image';
import dayjs from 'dayjs';

import type { GetServerSideProps } from 'next/types';

import ErrorIcon from '../components/error-icon.component';
import SummaryCard from '../components/summary-card.component';

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
          <div className="alert alert-error shadow-lg my-10">
            <div>
              <ErrorIcon />
              <span>{apiError.error}</span>
            </div>
          </div>
        ) : (
          <>
            {findAllTemperaturesResponse.count > 0 && (
              <section className="my-10" data-testid="cards-section">
                <div className="flex flex-wrap items-center justify-center">
                  <SummaryCard
                    title="Temperature"
                    content={`${findAllTemperaturesResponse.data[0].temperature.toFixed(1)}°C`}
                  />

                  <SummaryCard
                    title="Humidity"
                    content={`${findAllTemperaturesResponse.data[0].humidity.toFixed(1)}°C`}
                  />

                  <SummaryCard
                    title="Measured at"
                    content={`${dayjs(findAllTemperaturesResponse.data[0].measuredAt).format(
                      'DD/MM/YYYY HH:mm',
                    )}`}
                  />
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold">Measurements log</h2>

              <div className="overflow-x-auto mt-5">
                <table className="table table-zebra w-full" data-testid="measurements-table">
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
        apiError: {
          error: 'There was an error while querying the temperatures, please try again later!',
        },
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
