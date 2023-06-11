<!-- markdownlint-disable MD033 MD041 -->
<p align="center">
  <img src="docs/icon.png" width="120">
  <h1 align="center">RPi Smart Thermometer</h1>
  <p align="center">
    <img src="https://github.com/mathcale/rpi-iot-thermometer/actions/workflows/tests.yml/badge.svg?branch=main" alt="GH Actions badge">
  </p>
</p>

## Architecture

![Architecture diagram](docs/rpi-smart-thermometer-architecture.drawio.png)

Every 30 minutes, a Node.js script reads the current temperature and humidity from the DHT22 sensor plugged to a Raspberry Pi Zero W via GPIO and then publishes this data via MQTT to the Mosquitto server.

On the server stack, a Nest.js microsservice listens to a specific topic on the Mosquitto server and, when there's a new message, it gets parsed, validated and stored on a PostgreSQL database. This stack is deployed with Docker Compose to my local Raspberry Pi 4 home server.

There's also a button that, when pressed, will fetch the latest reading from the Nest.js API and show it on the OLED display. After 20s, the display will turn off to avoid burn-in.

## Schematics

![Hardware schematics](docs/rpi-smart-thermometer-schematics.png)

## Tech

### Hardware

- Raspberry Pi Zero W
- DHT22 sensor
- OLED display
- Push button
- 1K resistor

### Software

- Node.js 16
- Typescript
- Nest.js
- Next.js
- Docker
- PostgreSQL
- Mosquitto
