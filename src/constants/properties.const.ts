// a map of the API properties to module properties
export const PROPERTIES = {
  power: {
    prop: "power",
    trackable: true,
    raw: false
  },
  standby: {
    prop: "standby",
    trackable: false,
    raw: false
  },
  mode: {
    prop: "setmode",
    trackable: true,
    raw: false
  },
  automode: {
    prop: "automode",
    trackable: false,
    raw: false
  },
  fanSpeed: {
    prop: "setfan",
    trackable: true,
    raw: false
  },
  setTemperature: {
    prop: "settemp",
    trackable: true,
    raw: true,
    useOffset: true
  },
  roomTemperature: {
    prop: "roomtemp",
    trackable: false,
    raw: true,
    useOffset: true
  },
  airDirV: {
    prop: "airdir",
    trackable: true,
    raw: false
  },
  airDirH: {
    prop: "airdirh",
    trackable: true,
    raw: false
  }
};