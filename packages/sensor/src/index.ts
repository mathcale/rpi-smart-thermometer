import { promises as sensor } from 'node-dht-sensor';
import dotenv from 'dotenv';
import { connect as mqttConnect, MqttClient } from 'mqtt';
import oled from 'rpi-oled';

import logger from './utils/logger';
import { showTemperatureOnDisplay } from './utils/show-temperarute-on-display.util';

dotenv.config();

const SENSOR_TYPE = 22;
const SENSOR_PIN = 4;

const oledOptions = {
  width: 128,
  height: 64,
};

const clientId = process.env.MQTT_CLIENT_ID;
const brokerEndpoint = `mqtt://${process.env.MQTT_BROKER_HOST}:${process.env.MQTT_BROKER_PORT}`;

export async function run(mqttClient: MqttClient, oledDisplay: any) {
  try {
    const result = await sensor.read(SENSOR_TYPE, SENSOR_PIN);
    const measuredAt = new Date().toISOString();

    logger.info(
      `Got temp = ${result.temperature.toFixed(1)}°C, humidity = ${result.humidity.toFixed(1)}%`,
    );

    showTemperatureOnDisplay(oledDisplay, {
      temperature: result.temperature,
      humidity: result.humidity,
      measuredAt,
    });

    const topic = 'sensors/temperatures/create';
    const payload = {
      clientId,
      temperature: result.temperature,
      humidity: result.humidity,
      measuredAt,
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
