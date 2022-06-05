import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import IndexPage from '../src/pages/index';

import { FindAllTemperaturesOutput } from '../src/dto/find-all-temperatures.output';

describe('IndexPage', () => {
  const findAllTemperaturesResponseMock: FindAllTemperaturesOutput = {
    count: 1,
    pageSize: 10,
    data: [
      {
        externalId: 'test-1',
        temperature: 20,
        humidity: 80,
        measuredAt: '2022-05-27T20:00:00.000Z',
        clientId: 'test-client-1',
        createdAt: '2022-05-27T20:00:01.000Z',
      },
    ],
  };

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('When rendering page with temperatures returned from api', () => {
    it('Should render summary cards correctly', () => {
      const renderResult = render(
        <IndexPage
          findAllTemperaturesResponse={findAllTemperaturesResponseMock}
          apiError={null}
          apiEndpoint="http://localhost:3000"
        />,
      );

      const cardsSection = renderResult.getByTestId('cards-section');
      expect(cardsSection).toBeVisible();

      const temperatureSummaryCardValue = renderResult.getByTestId(
        'temperature-summary-card-value',
      );
      const humiditySummaryCardValue = renderResult.getByTestId('humidity-summary-card-value');
      const measuredAtSummaryCardValue = renderResult.getByTestId('measured-at-summary-card-value');

      expect(temperatureSummaryCardValue.textContent).toEqual('20.0°C');
      expect(humiditySummaryCardValue.textContent).toEqual('80.0%');
      expect(measuredAtSummaryCardValue.textContent).toEqual('27/05/2022 20:00');
    });

    it('Should render measurements table correctly', () => {
      const renderResult = render(
        <IndexPage
          findAllTemperaturesResponse={findAllTemperaturesResponseMock}
          apiError={null}
          apiEndpoint="http://localhost:3000"
        />,
      );

      const measurementsTable = renderResult.getByTestId('measurements-table');
      const tableRows = measurementsTable.querySelectorAll('tbody tr');

      expect(measurementsTable).toBeVisible();
      expect(tableRows).toHaveLength(findAllTemperaturesResponseMock.data.length);
    });
  });
});
