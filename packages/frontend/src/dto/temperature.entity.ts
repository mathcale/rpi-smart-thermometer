export interface Temperature {
  externalId: string;
  temperature: number;
  humidity: number;
  clientId: string;
  measuredAt: string;
  createdAt: string;
}

export type SimpleTemperature = Pick<Temperature, 'externalId' | 'temperature' | 'measuredAt'>;
