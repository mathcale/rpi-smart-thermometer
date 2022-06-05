import { useState, useRef, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dayjs from 'dayjs';

import type { GetServerSideProps } from 'next/types';

import ErrorIcon from '../components/icons/error.icon.component';
import SummaryCard from '../components/summary-card.component';
import Table from '../components/table.component';

import { ApiError } from '../dto/api-error.output';
import { FindAllTemperaturesOutput } from '../dto/find-all-temperatures.output';
import { Temperature } from '../dto/temperature.entity';

import IconImage from '../../public/icon.png';

interface IndexPageProps {
  findAllTemperaturesResponse?: FindAllTemperaturesOutput;
  apiError?: ApiError;
  apiEndpoint: string;
}

export default function IndexPage({
  findAllTemperaturesResponse,
  apiError,
  apiEndpoint,
}: IndexPageProps) {
  const [data, setData] = useState<Temperature[] | null>(findAllTemperaturesResponse.data);
  const [pageCount, setPageCount] = useState<number>(
    Math.ceil(findAllTemperaturesResponse.count / findAllTemperaturesResponse.pageSize),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchIdRef = useRef(0);

  const columns = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'measuredAt',
      },
      {
        Header: 'Temperature',
        accessor: 'temperature',
      },
      {
        Header: 'Humidity',
        accessor: 'humidity',
      },
    ],
    [],
  );

  const fetchData = useCallback(async ({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;

    if (fetchId === fetchIdRef.current) {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${apiEndpoint}/v1/temperatures?pageSize=${pageSize}&page=${pageIndex + 1}`,
        );
        const serverData: FindAllTemperaturesOutput = await response.json();

        setData(serverData.data);
        setPageCount(Math.ceil(serverData.count / serverData.pageSize));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                    testId="temperature-summary-card-value"
                  />

                  <SummaryCard
                    title="Humidity"
                    content={`${findAllTemperaturesResponse.data[0].humidity.toFixed(1)}%`}
                    testId="humidity-summary-card-value"
                  />

                  <SummaryCard
                    title="Measured at"
                    content={`${dayjs(findAllTemperaturesResponse.data[0].measuredAt).format(
                      'DD/MM/YYYY HH:mm',
                    )}`}
                    testId="measured-at-summary-card-value"
                  />
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold">Measurements log</h2>

              <div className="overflow-x-auto mt-5">
                <Table
                  columns={columns}
                  data={data}
                  pageCount={pageCount}
                  loading={isLoading}
                  fetchData={fetchData}
                />
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
        apiEndpoint: process.env.API_URL_FOR_BROWSER,
      },
    };
  }

  return {
    props: {
      findAllTemperaturesResponse: data,
      apiError: null,
      apiEndpoint: process.env.API_URL_FOR_BROWSER,
    },
  };
};
