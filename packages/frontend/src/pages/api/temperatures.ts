import type { NextApiRequest, NextApiResponse } from 'next';

import { ApiError } from '../../dto/api-error.output';
import { FindAllTemperaturesOutput } from '../../dto/find-all-temperatures.output';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FindAllTemperaturesOutput | ApiError>,
) {
  const response = await fetch(`${process.env.API_URL}/v1/temperatures`);
  const data: FindAllTemperaturesOutput = await response.json();

  if (!response.ok) {
    console.error('temperatures.handler:', data);

    return res.status(response.status).json({
      error: 'There was an error while querying the temperatures, please try again later!',
    });
  }

  return res.status(200).json(data);
}
