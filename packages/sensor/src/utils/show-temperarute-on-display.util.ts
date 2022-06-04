import font from 'oled-font-5x7';

import { TemperatureSummary } from '../dto/temperature-summary.output';

import logger from './logger';

export function showTemperatureOnDisplay(oledDisplay: any, result: TemperatureSummary): void {
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

  oledDisplay.setCursor(1, 50);
  oledDisplay.writeString(font, 1, 'Data:', 1, true);

  oledDisplay.setCursor(1, 60);
  oledDisplay.writeString(font, 1, `${result.measuredAt}`, 1, true);

  setTimeout(() => oledDisplay.turnOffDisplay(), 10000);
}
