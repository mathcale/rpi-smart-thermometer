import { promises as sensor } from 'node-dht-sensor';
import { connect as mqttConnect } from 'mqtt';
import oled from 'rpi-oled';

import { run } from './';

jest.mock('node-dht-sensor', () => ({
  promises: {
    read: async () => ({
      temperature: 20,
      humidity: 85,
    }),
  },
}));

jest.mock('rpi-oled', () =>
  jest.fn().mockImplementation(() => ({
    turnOnDisplay: jest.fn(),
    clearDisplay: jest.fn(),
    dimDisplay: jest.fn(),
    setCursor: jest.fn(),
    writeString: jest.fn(),
    turnOffDisplay: jest.fn(),
  })),
);

describe('Sensor', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  afterAll(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('Should read value from sensor, write it on OLED display and post it to mqtt topic', async () => {
    const mqttClient = mqttConnect('mqtt://localhost:1883', {
      clientId: 'test-client',
      clean: false,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    const oledDisplay = new oled({ width: 128, height: 64 });

    const sensorReadSpy = jest.spyOn(sensor, 'read');
    const mqttPublishSpy = jest.spyOn(mqttClient, 'publish');
    const oledDisplayWriteSpy = jest.spyOn(oledDisplay, 'writeString');

    await run(mqttClient, oledDisplay);

    jest.runAllTimers();

    expect(sensorReadSpy).toBeCalledTimes(1);
    expect(mqttPublishSpy).toBeCalledTimes(1);
    expect(oledDisplayWriteSpy).toBeCalledTimes(3);
  });
});
