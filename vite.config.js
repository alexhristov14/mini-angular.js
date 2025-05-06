import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@mini-angular": path.resolve(__dirname, "./src/framework"),
    },
  },
});
