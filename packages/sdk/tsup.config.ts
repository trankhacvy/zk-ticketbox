import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  minify: true,
  clean: true,
  ...options,
}));
