import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// Load test environment variables
dotenv.config({ path: ".env.test" });

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["tests/unit/**/*.test.ts"],
          exclude: ["tests/unit/components/**"],
          setupFiles: [
            "./tests/_helpers/setup.ts",
            "./tests/_helpers/component-setup.ts",
          ],
          fileParallelism: false,
        },
      },
      {
        extends: true,
        test: {
          name: "component",
          include: ["tests/unit/components/**/*.test.tsx"],
          setupFiles: ["./tests/_helpers/component-setup.ts"],
          environment: "jsdom",
        },
      },
    ],
  },
});
