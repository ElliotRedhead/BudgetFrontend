import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	css: {
		preprocessorOptions: {
			// Bootstrap's Sass uses features newer Sass deprecates; hide those
			// warnings but keep any from this project's own styles.
			scss: { quietDeps: true, silenceDeprecations: ["import"] }
		}
	},
	// The backend's CORS settings allow this origin by default.
	server: { port: 3000 },
	preview: { port: 3000 },
	test: {
		environment: "jsdom",
		// A fixed zone with daylight saving makes date handling tests meaningful.
		env: { TZ: "Europe/London" },
		setupFiles: ["src/test/setup.ts"]
	}
});
