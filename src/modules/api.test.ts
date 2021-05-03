import { assert } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { deleteVar } from '../utils/store.ts';
import { checkAuth, login, logout } from './api.ts';

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