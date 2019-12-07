const util = require("util");

module.exports = (topic, params) => {
  if (topic == "hobby/control/devices/rsp") {
    params[0].Devices.map(device => {
      if (device.Model === "thermostat") {
        //console.log(device);
      }
    });
  }
  return { topic, params };
};
