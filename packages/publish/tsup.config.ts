import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  esbuildOptions: (options) => {
    options.banner = {
      js: '"use client";',
    };
  },
});
