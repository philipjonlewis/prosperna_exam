// @ts-nocheck

import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "./src/tests/userAuth/*"],
    // include: [
    //   ...configDefaults.include,
    //   "./src/tests/userAuth/userAuth-failure.signup.test.ts",
    // ],
    globalSetup: "./src/model/dbTesting.ts",
  },
});
