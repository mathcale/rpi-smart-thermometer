import { Gpio } from 'onoff';
import oled from 'rpi-oled';
import dotenv from 'dotenv';

import { RemoteService } from './services/remote.service';

import logger from './utils/logger';
import { showTemperatureOnDisplay } from './utils/show-temperarute-on-display.util';

dotenv.config();

const oledOptions = {
  width: 128,
  height: 64,
};

const button = new Gpio(17, 'in', 'both', { debounceTimeout: 50 });
const oledDisplay = new oled(oledOptions);

button.watch(async (err, value) => {
  if (err) {
    logger.error('button.watch:', err);
    return;
  }

  if (value === 0) {
    return;
  }

  try {
    const { temperature, humidity, measuredAt } = await RemoteService.getLatestReading();

    showTemperatureOnDisplay(oledDisplay, {
      temperature,
      humidity,
      measuredAt,
    });
  } catch (err) {
    logger.error(err);
  }
});

process.on('SIGINT', () => {
  button.unexport();
});

logger.info(`Display app is running, PID = ${process.pid}`);
