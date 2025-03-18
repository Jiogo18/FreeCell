import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import deno from "@deno/vite-plugin";

import "react";
import "react-dom";

// https://vite.dev/config/
export default defineConfig({
  base: Deno.env.get('VITE_BASE_PATH') ?? "/",
  plugins: [
    ...(react() as PluginOption[]),
    ...(deno() as PluginOption[]),
  ],
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
});
