import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ jsxImportSource: "react" })],
  base: '/', // Ensures correct path handling,
  server: {
    historyApiFallback: true, // Ensures proper routing in development
  },

  test: {
    globals: true, // Enable global testing APIs like `vi` and `expect`
    environment: "jsdom", // Use jsdom environment for DOM testing
    /* setupFiles: "./src/__test__/testAmenityDelete.test", // Path to setup file (optional)
    transformMode: {
      web: [/.[jt]sx?$/], // Ensure JSX is transformed properly
    }, */
  },
});
