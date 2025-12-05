import { createDefaultEsmPreset } from "ts-jest";

const preset = createDefaultEsmPreset();

/** @type {import("jest").Config} **/
export default {
  ...preset,
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  }
};