import { APP_VERSION, MITSU_USERNAME, MITSU_PASSWORD } from '../environment.ts';
import { deleteVar, getVar, hasVar, setVar } from '../utils/store.ts';
import { ILoginResponse, ILogoutResponse, IUnitCapabilities, IUnitState } from "./api.types.ts";

// REST call points
const BASE_URL = 'https://api.melview.net';
const LOGIN_URL = `${BASE_URL}/api/login.aspx`;
const LOGOUT_URL = `${BASE_URL}/api/logout.aspx`;
const UNIT_CAPABILITIES_URL = `${BASE_URL}/api/unitcapabilities.aspx`;
const UNIT_COMMAND_URL = `${BASE_URL}/api/unitcommand.aspx`;

// Store Values
interface StoreApi {
  cookie: string;
  loginData: ILoginResponse;
  units: IUnitCapabilities[];
}
type StoreKeys = keyof StoreApi;
const getStoreCookie = (): string | undefined => getVar<StoreKeys, string>('cookie');
const getStoreLoginData = (): ILoginResponse | undefined => getVar<StoreKeys, ILoginResponse>('loginData');
const getStoreUnits = (): IUnitCapabilities[] | undefined => getVar<StoreKeys, IUnitCapabilities[]>('units');

/**
 * Check if user is currently authenticated
 */
export function checkAuth(): boolean {
  return hasVar<StoreKeys>('cookie');
}

/**
 * Fetch wrapper with appended auth cookie
 * 
 * Note: discards other headers .. YAGNI
 */
async function fetchAuth<T = unknown>(input: Request | URL | string, init?: RequestInit): Promise<T> {
  if (!checkAuth()) {
    await login();
  }
  const cookie = getStoreCookie();
  if (!cookie) {
    throw Error('Invalid or missing cookie');
  }
  const headers = new Headers();
  headers.append('cookie', cookie);
  const initWithCookie: RequestInit = {
    ...init,
    headers,
  }
  const result = await fetch(input, initWithCookie);
  if (result.status !== 200) {
    throw Error(`Query unsuccessful, status: ${result.status}`);
  }
  try {
    return await result.json();
  } catch {
    const text = await result.text();
    throw Error(`Could not parse response JSON, text: ${text}`);
  }
}

/**
 * Authenticate and store cookie
 */
export async function login(): Promise<ILoginResponse> {
  const response = await fetch(LOGIN_URL, {
    method: "POST",
    body: JSON.stringify({
      appversion: APP_VERSION,
      user: MITSU_USERNAME,
      pass: MITSU_PASSWORD,
    }),
  });

  if (response.status !== 200) {
    throw Error(`Login unsuccessful, status: ${response.status}`);
  }

  const cookie = response.headers.get('set-cookie');
  if (!cookie) {
    throw Error(`Login unsuccessful, failed to retrieve cookie value`);
  }
  setVar<StoreKeys, string>('cookie', cookie);
  
  const body = await response.json();
  setVar<StoreKeys, ILoginResponse>('loginData', body);
  return body;
}

/**
 * Logout and delete cookie
 */
export async function logout(): Promise<void> {
  const response = await fetch(LOGOUT_URL, {
    method: "POST",
    body: JSON.stringify({
      appversion: APP_VERSION,
    }),
  });

  if (response.status !== 200) {
    throw Error(`Login unsuccessful, status: ${response.status}`);
  }

  const cookie = response.headers.get('set-cookie');
  if (!cookie) {
    throw Error(`Login unsuccessful, failed to retrieve cookie value`);
  }
  deleteVar<StoreKeys>('cookie');

  const body: ILogoutResponse = await response.json();
  if (body.status !== 'loggedout') {
    throw Error(`Error logging out, unexpected server response ${JSON.stringify(body)}`);
  }
  deleteVar<StoreKeys>('loginData');

}

/**
 * Get user login data, either from store or API
 */
export async function getLoginData(): Promise<ILoginResponse> {
  const storeLoginData = getStoreLoginData();
  if (storeLoginData) {
    return storeLoginData;
  }
  console.info('Authenticating user..');
  return await login();
}

export async function getAllUnitCapabilities(): Promise<IUnitCapabilities[]> {
  const loginData = await getLoginData();
  const units: IUnitCapabilities[] = [];
  for (let i = 0; loginData.userunits > i; i++) {
    console.info('Getting unit idx', i);
    try {
      const unit = await getUnitCapabilities(i);
      units.push(unit);
    } catch (e) {
      console.warn(`Could not fetch unit idx "${i}"`, e);
    }
  }
  return units;
}

export async function getUnitCapabilities(unitIdx: number): Promise<IUnitCapabilities> {
  const unit = await fetchAuth<IUnitCapabilities>(UNIT_CAPABILITIES_URL, {
    method: 'POST',
    body: JSON.stringify({
      unitid: unitIdx,
    }),
  });

  // Update store
  const units = getStoreUnits() ?? [];
  const existingUnitIdx = units.findIndex(u => u.id === unit.id);
  if (existingUnitIdx !== -1) {
    units[existingUnitIdx] = unit;
  } else {
    units.push(unit);
  }
  setVar<StoreKeys, IUnitCapabilities[]>('units', units);

  return unit;
}

export async function getAllUnitStates(): Promise<IUnitState[]> {
  const units = getStoreUnits() ?? [];
  if (!units.length) {
    throw Error('No units stored, please fetch unit capabilities');
  }
  const unitStates: IUnitState[] = [];
  for (const unit of units) {
    console.info('Fetching state for unit ID', unit.id);
    try {
      const unitState = await getUnitState(unit.id);
      unitStates.push(unitState);
    } catch (e) {
      console.warn(`Could not fetch state for unit ID "${unit.id}"`, e);
    }
  }
  return unitStates;
}

export async function getUnitState(unitId: string): Promise<IUnitState> {
  const body = await fetchAuth<IUnitState>(UNIT_COMMAND_URL, {
    method: "POST",
    body: JSON.stringify({ unitid: unitId, v: 2 }),
  });
  return body;
}

export async function updateUnitState(unitId: string, commands: string): Promise<IUnitState> {
  const result = await fetchAuth<IUnitState>(UNIT_COMMAND_URL, {
    method: "POST",
    body: JSON.stringify({ unitid: unitId, v: 2, lc: 1, commands }),
  });
  return result;
}

export async function updateUnitStateLocal(unit: IUnitCapabilities, commands: string): Promise<void> {
  const commandStr = [
    '<?xml version="1.0" encoding="UTF-8"?><CSV><CONNECT>ON</CONNECT><CODE><VALUE>',
    commands,
    '</VALUE></CODE></CSV>',
  ].join('');
  const result = await fetch(`http://${unit.localip}/smart`, {
    method: 'POST',
    body: commandStr,
  });
  if (result.status !== 200) {
    throw Error(`Could not send local command, status: ${result.status}`);
  }
}