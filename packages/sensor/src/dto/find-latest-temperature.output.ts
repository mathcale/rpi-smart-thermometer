export interface FindLatestTemperatureOutput {
  externalId: string;
  temperature: number;
  humidity: number;
  clientId: string;
  measuredAt: string;
  createdAt: string;
}
