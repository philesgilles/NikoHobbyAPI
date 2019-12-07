const mqtt = require("mqtt");
require("dotenv").config();
const config = require("./config/mqtt");
// var nhc2 = new nhc2.NHC2("mqtts://10.0.1.50", {
//   port: 8884,
//   clientId: "PhilMacbook",
//   username: "hobby",
//   password:
//     "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJob2JieSIsImlhdCI6MTU3NDQ0ODMxNSwiZXhwIjoxNjA2MDcwNzE1LCJyb2xlIjpbImhvYmJ5Il0sImF1ZCI6IkZQMDAxMTJBMjI1RjMyIiwiaXNzIjoibmhjLWNvcmUiLCJqdGkiOiJlNWNmMmI5MS04NjQ2LTRjOWItODI0NC1mYzc2YjM3ZTFkYTIifQ.ckKF1siWenP1heJYW_UDVFmkp2RCMQAION1T0FNE9vZ1mHr-Nd88XkJwPPPeTZHnKi02Y_yFPxz69Jq9rbJQpOZ45S0tOWgFKSL3-QDcTpIAljVBVMtLY9nvPT6aLfMef8y1ThupLnVKy6WFM-VoUgMIMD0fuCFWJ_h5AKadstB001HHmeJaBiTV-vlJIf95L5iUduwrPtJ0EMgzpndhFVWP_KIw0YWAtGksiKGyEdoNo9R5n0G_k0N18FaH8lHjn5Yga657_27UY8gz0TIff2FWUm_ZEV1kblrrHDc41JrtqhiaX7E7CLUe-EPWwZU_owg_8JLz7fubodQ7EnHMDA",
//   rejectUnauthorized: false
// });

console.log(config.options);

client = mqtt.connect(config.url, config.options);

client.on("connect", function() {
  console.log("Connected");
  client.subscribe("hobby/control/devices/#");
});

client.on("error", function() {
  console.log("Error");
});

client.on("offline", function() {
  console.log("Disconnected");
});

client.on("message", function(topic, message) {
  console.log("topic", topic);
  console.log("message", message.toString());
});
