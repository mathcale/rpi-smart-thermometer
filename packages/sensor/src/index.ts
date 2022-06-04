import { promises as sensor, SensorData } from 'node-dht-sensor';
import dotenv from 'dotenv';
import { connect as mqttConnect, MqttClient } from 'mqtt';
import oled from 'rpi-oled';
import font from 'oled-font-5x7';

import logger from './utils/logger';

dotenv.config();

const SENSOR_TYPE = 22;
const SENSOR_PIN = 4;

const oledOptions = {
  width: 128,
  height: 64,
};

const clientId = process.env.MQTT_CLIENT_ID;
const brokerEndpoint = `mqtt://${process.env.MQTT_BROKER_HOST}:${process.env.MQTT_BROKER_PORT}`;

export function showOnDisplay(oledDisplay: any, result: SensorData): void {
  logger.info('Displaying readings result on OLED screen...');

  oledDisplay.turnOnDisplay();
  oledDisplay.clearDisplay();
  oledDisplay.dimDisplay(true);

  oledDisplay.setCursor(1, 1);
  oledDisplay.writeString(font, 1, 'Temperatura:', 1, true);

  oledDisplay.setCursor(1, 10);
  oledDisplay.writeString(font, 1, `${result.temperature.toFixed(1)}°C`, 1, true);

  oledDisplay.setCursor(1, 30);
  oledDisplay.writeString(font, 1, 'Humidade:', 1, true);

  oledDisplay.setCursor(1, 40);
  oledDisplay.writeString(font, 1, `${result.humidity.toFixed(1)}%`, 1, true);

  setTimeout(() => oledDisplay.turnOffDisplay(), 10000);
}

export async function run(mqttClient: MqttClient, oledDisplay: any) {
  try {
    const result = await sensor.read(SENSOR_TYPE, SENSOR_PIN);

    logger.info(
      `Got temp = ${result.temperature.toFixed(1)}°C, humidity = ${result.humidity.toFixed(1)}%`,
    );

    showOnDisplay(oledDisplay, result);

    const topic = 'sensors/temperatures/create';
    const payload = {
      clientId,
      temperature: result.temperature,
      humidity: result.humidity,
      measuredAt: new Date().toISOString(),
    };

    logger.info('Publishing data...');

    mqttClient.publish(topic, JSON.stringify(payload), { qos: 2, retain: false }, (error) => {
      if (error) {
        logger.error(error);
      }
    });
  } catch (err) {
    logger.error('Failed to read sensor data:', err);
  } finally {
    logger.info('Closing connection...');
    mqttClient.end();
  }
}

const oledDisplay = new oled(oledOptions);

const mqttClient = mqttConnect(brokerEndpoint, {
  clientId,
  clean: process.env.NODE_ENV !== 'production',
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

mqttClient.on('connect', () => {
  logger.info('Connected to MQTT broker!');
});

mqttClient.on('disconnect', () => {
  logger.info('Disconnected from MQTT broker!');
});

mqttClient.on('message', (topic, payload) => {
  logger.info(`Message on topic "${topic}": ${payload}`);
});

run(mqttClient, oledDisplay);
