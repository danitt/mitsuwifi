import { assert } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { deleteVar } from '../utils/store.ts';
import { checkAuth, getAllUnitCapabilities, getLoginData, login, logout } from './api.ts';

const testAuth = Deno.args.includes('--auth');

if (testAuth) {
  Deno.test("API Login / Logout", async () => {
    // Clean slate
    deleteVar('cookie');
    assert(!checkAuth());

    // Login
    try {
      await login();
    } catch (e) {
      assert(!!e);
    }
    assert(checkAuth());

    // Logout
    try {
      await logout();
    } catch (e) {
      assert(!!e);
    }
    assert(!checkAuth());
  });
}

Deno.test("Read user login data", async () => {
  const loginData = await getLoginData();
  assert(!!loginData);
});

Deno.test('Get all unit capabilities', async () => {
  const unitDetail = await getAllUnitCapabilities();
  console.info({ unitDetail });
  assert(!!unitDetail);
});