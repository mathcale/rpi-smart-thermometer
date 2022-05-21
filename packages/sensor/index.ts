import { promises } from "node-dht-sensor";

const SENSOR_TYPE = 22;
const SENSOR_PIN = 4;

async function run() {
  try {
    const result = await promises.read(SENSOR_TYPE, SENSOR_PIN);

    console.log(
      `temp: ${result.temperature.toFixed(1)}°C, ` +
        `humidity: ${result.humidity.toFixed(1)}%`
    );
  } catch (err) {
    console.error("Failed to read sensor data:", err);
  }
}

run();
