module.exports = {
  url: process.env.MQTT_HOST,
  options: {
    port: process.env.MQTT_PORT,
    clientId: process.env.MQTT_CID,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    rejectUnauthorized: false
  }
};
