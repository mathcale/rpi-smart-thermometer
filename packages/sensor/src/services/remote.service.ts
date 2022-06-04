import { request } from 'undici';

import logger from '../utils/logger';

import { ApiError } from '../dto/api-error.output';
import { FindLatestTemperatureOutput } from '../dto/find-latest-temperature.output';

export const RemoteService = {
  getLatestReading: async (): Promise<FindLatestTemperatureOutput | never> => {
    logger.info('Fetching latest temperature reading from server...');

    const response = await request(`${process.env.API_URL}/v1/temperatures`);
    const data: FindLatestTemperatureOutput = await response.body.json();

    if (response.statusCode >= 400) {
      logger.error('RemoteService.getLatestReading: ', (data as unknown as ApiError).error);
      throw new Error((data as unknown as ApiError).error);
    }

    logger.info('Got temperature from server!');

    return data;
  },
};
