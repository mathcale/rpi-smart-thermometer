#!/bin/bash

SECONDS=0
echo "Deploying project..."

rsync \
  -avz \
  --exclude node_modules \
  --exclude .git \
  --exclude scripts \
  --exclude .env* \
  . \
  pi@pizero.local:~/dev/rpi-iot-thermometer-sensor

echo "Done in ${SECONDS}s"
