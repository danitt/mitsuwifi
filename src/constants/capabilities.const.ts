// commands used to control the heat pump
// all capabilties are listed here, they get enabled if the capabilities of the
// unit allow for the particular command
export const CAPABILITIES = {
  action: {
    setmode: "MD",
    setfan: "FS",
    power: "PW",
    settemp: "TS",
    airdirh: "AH", //hasairdirh
    airdir: "AV"  //hasairdir
  },
  setmode: {
    heat: "1",
    dry: "2",     //hasdrymode
    cool: "3",
    fan: "7",
    auto: "8"     //hasautomode
  },
  power: {
    on: "1",
    off: "0"
  },
  setfan: {
    auto: "0",    //hasautofan
    1: {          //fanstage: 1
      1: "5"
    },
    2: {          //fanstage: 2
      1: "2",
      2: "5"
    },
    3: {          //fanstage: 3
      1: "2",
      2: "3",
      3: "5"
    },
    4: {          //fanstage: 4
      1: "2",
      2: "3",
      3: "5",
      4: "6"
    },
    5: {          //fanstage: 5
      1: "1",
      2: "2",
      3: "3",
      4: "5",
      5: "6"
    }
  },
  airdirh: {
    1: {          //hasairdirh
      auto: "0",
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      swing: "12"
    }
  },
  airdir: {
    auto: "0",    //hasairauto
    1: {          //hasairdir
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5"
    },
    swing: "7"    //hasswing
  }
};

// filters used to check if functionality is present
export const CAPABILITIES_FILTERS = {
  action: {
    airdirh: {
      capability: "hasairdirh",
      value: "1"
    },
    airdir: {
      capability: "hasairdir",
      value: "1"
    }
  },
  setmode: {
    dry: {
      capability: "hasdrymode",
      value: "1"
    },
    auto: {
      capability: "hasautomode",
      value: "1"
    }
  },
  setfan: {
    auto: {
      capability: "hasautofan",
      value: "1"
    },
    1: {
      capability: "fanstage",
      value: "1",
      copySubsection: true
    },
    2: {
      capability: "fanstage",
      value: "2",
      copySubsection: true
    },
    3: {
      capability: "fanstage",
      value: "3",
      copySubsection: true
    },
    4: {
      capability: "fanstage",
      value: "4",
      copySubsection: true
    },
    5: {
      capability: "fanstage",
      value: "5",
      copySubsection: true
    }
  },
  airdir: {
    auto: {
      capability: "hasairauto",
      value: "1"
    },
    swing: {
      capability: "hasswing",
      value: "1"
    },
    1: {
      capability: "hasairdir",
      value: "1",
      copySubsection: true
    }
  },
  airdirh: {
    1: {
      capability: "hasairdirh",
      value: "1",
      copySubsection: true
    }
  }
};

// only these capabilties are stored in the session file
export const CAPABILITIES_KNOWN = [
  'id',
  'unitname',
  'modeltype',
  'fanstage',
  'hasairdir',
  'hasswing',
  'hasautomode',
  'hasautofan',
  'hasdrymode',
  'hasairauto',
  'hasairdirh',
  'max',
  'localip'
];