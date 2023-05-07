import { defineConfig } from "tsup";

export default defineConfig({
  esbuildOptions: (options) => {
    options.banner = {
      js: '"use client";',
    };
  },
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm"],
});
