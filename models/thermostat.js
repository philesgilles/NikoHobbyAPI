module.exports = (setTemp, setTime, overrule, Uuid) => {
  //console.log(setTemp, setTime);

  let data = {
    Method: "devices.control",
    Params: [
      {
        Devices: [
          {
            Properties: [
              { OverruleSetpoint: setTemp.toString() },
              { OverruleTime: setTime.toString() },
              { OverruleActive: overrule }
            ],
            Uuid: Uuid
          }
        ]
      }
    ]
  };
  //console.log(JSON.stringify(data));
  return { topic: "hobby/control/devices/cmd", data: JSON.stringify(data) };
};
