module.exports = {
  mqtt: {
    url: process.env.MQTT_HOST,
    options: {
      port: process.env.MQTT_PORT,
      clientId: process.env.MQTT_CID + Math.floor(Math.random() * 100),
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      rejectUnauthorized: false
    }
  },
  rabbitmqUrl: process.env.AMQP_URL
};
