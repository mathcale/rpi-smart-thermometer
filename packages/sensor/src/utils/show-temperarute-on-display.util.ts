import dayjs from 'dayjs';
import font from 'oled-font-5x7';

import { TemperatureSummary } from '../dto/temperature-summary.output';

import logger from './logger';

export function showTemperatureOnDisplay(oledDisplay: any, result: TemperatureSummary): void {
  logger.info('Displaying readings result on OLED screen...');

  oledDisplay.turnOnDisplay();
  oledDisplay.clearDisplay();
  oledDisplay.dimDisplay(true);

  oledDisplay.setCursor(1, 1);
  oledDisplay.writeString(font, 1, `T: ${result.temperature.toFixed(1)}°C`, 1, true);

  oledDisplay.setCursor(1, 20);
  oledDisplay.writeString(font, 1, `H: ${result.humidity.toFixed(1)}%`, 1, true);

  oledDisplay.setCursor(1, 40);
  oledDisplay.writeString(
    font,
    1,
    `Dt: ${dayjs(result.measuredAt).format('DD/MM/YYYY HH:mm')}`,
    1,
    true,
  );

  setTimeout(() => oledDisplay.turnOffDisplay(), 20000);
}
