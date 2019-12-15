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

//
// setup RabbitMQ connection
//

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
        const options = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "numeric"
        };
        let printDate = new Date().toLocaleDateString("en-US", options);
        let body = msg.content.toString();
        let payload = JSON.parse(body);
        const time = new Date();
        const hours = time.getHours();
        //const minutes = time.getMinutes();
        const day = time.getDay();
        if ((hours < 5 || hours > 18) || ((day === 6 || day === 0) && (hours >= 11 && hours < 15 ))) {
          if (payload.temp < 18.5) {
            console.log(printDate + " [Too Cold] -- Switch ON heating !");
            let { topic, data } = setNewTemp(
              25,
              60,
              "True",
              "27602995-f7bc-4e10-9e7c-8dabdf5e0400"
            );
            //console.log(topic, data);
            client.publish(topic, data);
          } else if (payload.temp > 21) {
            console.log(printDate + " [Temperature HIGH] -- Switch OFF heating !");
            let { topic, data } = setNewTemp(
              18,
              0,
              "False",
              "27602995-f7bc-4e10-9e7c-8dabdf5e0400"
            );
            //console.log(topic, data);
            client.publish(topic, data);
          } else {
            console.log(printDate + " [Temperature OK] -- Do Nothing !");
          }
        } else {
          console.log(printDate + " [NOT TIME] -- Automatic");
        }
        ch.ack(msg);
      }
    });
  });

client.on("connect", function() {
  console.log("[*] - NIKO Connected Locally");

});

client.on("error", function() {
  console.log("Error");
  process.exit(1);
});

client.on("offline", function() {
  console.log("Disconnected");
  process.exit(1);
});

client.on("close", function() {
  console.log("Connection closed");
  process.exit(1);
});
