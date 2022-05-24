import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(`${process.env.API_URL}/v1/temperatures`);
  const data = await response.json();

  if (!response.ok) {
    console.error('temperatures.handler:', data);

    return res.status(response.status).json({
      error: 'There was an error while querying the temperatures, please try again later!',
    });
  }

  return res.status(200).json(data);
}
