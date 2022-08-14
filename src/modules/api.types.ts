export interface ILoginResponse {
    id: number;
    country: 'Australia' | string;
    fullname: string;
    confirmcode: number;
    userunits: number;
    addbuilding: number;
    addunit: number;
    countryinfo: {
      country: 'Australia' | 'New Zealand' | string;
      companyname: string;
      supportphone: string;
      supporturl: string;
      addunitnote: string;
    }[];
    features: {
      groupcontrol: number;
      zonerules: number;
      halfdegcontrol: number;
    };
}

export interface ILogoutResponse {
  status: 'loggedout';
}

export interface IBuilding {
  buildingid: string;
  building: "Building" | string;
  bschedule: string;
  units: IUnit[];
}

export type Mode =
  | "1" /* Heat */
  | "2" /* Dry */
  | "3" /* Cool */
  | "7" /* Fan */
  | "8" /* Auto */;
export interface IUnit {
  room: string /*e.g. "Living Room" **/;
  unitid: string /* e.g. "170145" **/;
  power: "on" | "q" /* "q": off, "on": on **/;
  wifi: "3" /**
    "3" seems to mean good?
    @TODO wait for connectivity issue to capture failed state
    */;
  mode: Mode;
  temp: string /* e.g. "25" **/;
  settemp: string /* e.g. "25" **/;
  status: string;
  schedule1: number;
}

export interface IUnitCapabilities {
  id: string;
  unitname: string;
  unittype: string | "RAC";
  fault: string | "";
  userunits: number;
  modeltype: number;
  multi: number;
  halfdeg: number;
  adaptortype: string | "mac558";
  addons: string | "";
  localip: string;
  fanstage: number;
  hasairdir: number;
  hasswing: number;
  hasautomode: number;
  hascoolonly: number;
  hasautofan: number;
  hasdrymode: number;
  hasenergy: number;
  hasairauto: number;
  hasairdirh: number;
  max: Record<string, {
    min: number;
    max: number;
  }>;
  time: string; // e.g. "21:42 Mon"
  error: "ok" | string;
}

export interface IUnitState {
  id: string;
  power: number /** 0: off, 1: on */;
  standby: number;
  setmode: number;
  automode: number;
  setfan: number;
  settemp: string;
  roomtemp: string;
  outdoortemp: string;
  airdir: number;
  airdirh: number;
  sendcount: number;
  fault: "" | string;
  error: "ok" | string;
}