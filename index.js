const mqtt = require("mqtt");
require("dotenv").config();
const config = require("./config/config");
const nikoParser = require("./helpers/nikoParser");
const setNewTemp = require("./models/thermostat");
const amqp = require("amqplib");
//For debug
const util = require("util");
console.log("     -- NIKO HOBBY API --");
console.log("");
//
//Setup mqtt for NIKO HOME CONTROL
//
client = mqtt.connect(config.mqtt.url, config.mqtt.options);

client.on("connect", function() {
  console.log("[*] - NIKO Connected Locally");
  amqp.connect(config.rabbitmqUrl).then(function(conn) {
    process.once("SIGINT", function() {
      conn.close();
    });
    return conn.createChannel().then(function(ch) {
      console.log("[*] - AMQP Connected to server");
      var ok = ch.assertQueue("philPerso", { durable: true });
      ok = ok.then(function() {
        ch.prefetch(1);
      });
      ok = ok.then(function() {
        ch.consume("philPerso", doWork, { noAck: false });
        console.log("[*] - Waiting for messages. To exit press CTRL+C");
      });
      return ok;

      function doWork(msg) {
        let body = msg.content.toString();
        let payload = JSON.parse(body);
        if (payload.temp < 17) {
          console.log("[Too Cold] -- Switch on heating !");
          let { topic, data } = setNewTemp(
            25,
            60,
            "True",
            "27602995-f7bc-4e10-9e7c-8dabdf5e0400"
          );
          //console.log(topic, data);
          client.publish(topic, data);
        } else {
          console.log("[Temperature OK]");
          let { topic, data } = setNewTemp(
            18,
            0,
            "False",
            "27602995-f7bc-4e10-9e7c-8dabdf5e0400"
          );
          //console.log(topic, data);
          client.publish(topic, data);
        }
        ch.ack(msg);
      }
    });
  });
});

client.on("error", function() {
  console.log("Error");
});

client.on("offline", function() {
  console.log("Disconnected");
});

//
//SETUP AMQP for incoming messages
//
