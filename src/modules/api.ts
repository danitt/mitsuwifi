import { APP_VERSION, MITSU_USERNAME, MITSU_PASSWORD } from '../environment.ts';
import { deleteVar, getVar, hasVar, setVar } from '../utils/store.ts';
import { ILoginResponse, ILogoutResponse } from "./api.types.ts";

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
}
type StoreKeys = keyof StoreApi;

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
async function fetchAuth(input: Request | URL | string, init?: RequestInit): Promise<Response> {
  if (!checkAuth()) {
    await login();
  }
  const cookie = getVar<StoreKeys, string>('cookie');
  if (!cookie) {
    throw Error('Invalid or missing cookie');
  }
  const headers = new Headers();
  headers.append('cookie', cookie);
  const initWithCookie: RequestInit = {
    ...init,
    headers,
  }
  return await fetch(input, initWithCookie);
}

/**
 * Authenticate and store cookie
 */
export async function login(): Promise<ILoginResponse> {
  const response = await fetch(LOGIN_URL, {
    body: JSON.stringify({
      appversion: APP_VERSION,
      user: MITSU_USERNAME,
      pass: MITSU_PASSWORD,
    })
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
  return body;
}

/**
 * Logout and delete cookie
 */
export async function logout(): Promise<void> {
  const response = await fetch(LOGOUT_URL, {
    body: JSON.stringify({
      appversion: APP_VERSION,
    })
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
}