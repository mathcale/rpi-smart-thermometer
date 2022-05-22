import { promises as sensor } from 'node-dht-sensor';
import { connect as mqttConnect } from 'mqtt';

import { run } from './';

jest.mock('node-dht-sensor', () => ({
  promises: {
    read: async () => ({
      temperature: 20,
      humidity: 85,
    }),
  },
}));

describe('Sensor', () => {
  it('Should read value from sensor and post it to mqtt topic', async () => {
    const mqttClient = mqttConnect('mqtt://localhost:1883', {
      clientId: 'test-client',
      clean: false,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    const sensorReadSpy = jest.spyOn(sensor, 'read');
    const mqttPublishSpy = jest.spyOn(mqttClient, 'publish');

    await run(mqttClient);

    expect(sensorReadSpy).toBeCalledTimes(1);
    expect(mqttPublishSpy).toBeCalledTimes(1);
  });
});
