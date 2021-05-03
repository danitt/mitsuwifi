import { parse } from "https://deno.land/std@0.95.0/flags/mod.ts";
import { getAllUnitCapabilities, updateUnitState, getAllUnitStates, getLoginData, updateUnitStateLocal } from "./modules/api.ts";
import { CAPABILITIES } from './constants/capabilities.const.ts'

const args = parse(Deno.args)._ || [];

if (args.includes('userData')) {
  const userData = await getLoginData();
  console.info({ userData });
}

if (args.includes('unitCapabilities')) {
  const unitCapabilities = await getAllUnitCapabilities();
  console.info({ unitCapabilities });
}

if (args.includes('unitStates')) {
  const unitStates = await getAllUnitStates();
  console.info({ unitStates });
}

if (args.includes('allPowerOn')) {
  const powerCmd = CAPABILITIES.action.power;
  const units = await getAllUnitCapabilities();
  for (const unit of units) {
    try {
      await updateUnitState(unit.id, `${powerCmd}1`)
    } catch (e) {
      console.error(`Error switching on unit id${unit.id}`, e);
    }
  }
}

if (args.includes('allPowerOnLocal')) {
  const powerCmd = CAPABILITIES.action.power;
  const units = await getAllUnitCapabilities();
  for (const unit of units) {
    try {
      await updateUnitStateLocal(unit, `${powerCmd}1`)
    } catch (e) {
      console.error(`Error switching on unit id${unit.id}`, e);
    }
  }
}

if (args.includes('allPowerOff')) {
  const powerCmd = CAPABILITIES.action.power;
  const units = await getAllUnitCapabilities();
  for (const unit of units) {
    try {
      await updateUnitState(unit.id, `${powerCmd}0`)
    } catch (e) {
      console.error(`Error switching on unit id${unit.id}`, e);
    }
  }
}