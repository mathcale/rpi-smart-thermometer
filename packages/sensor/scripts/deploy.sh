#!/bin/bash

SECONDS=0
echo "Deploying project..."

rsync \
  -avz \
  --exclude node_modules \
  --exclude .git \
  --exclude scripts \
  --exclude .env* \
  --exclude src \
  --exclude jest.config.ts \
  . \
  pi@pizero.local:~/dev/rpi-smart-thermometer-sensor

echo "Done in ${SECONDS}s"
