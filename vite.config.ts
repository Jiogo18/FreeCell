import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import deno from "@deno/vite-plugin";

import "react";
import "react-dom";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    deno(),
  ],
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
});
