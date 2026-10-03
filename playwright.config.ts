import { defineConfig, devices } from "@playwright/test";

// The backend must already be running (see README). The frontend dev server
// is started here, pointed at it.
const port = Number(process.env.E2E_PORT ?? 3000);
const apiRoot = process.env.E2E_API_ROOT ?? "http://localhost:8000";

export default defineConfig({
	testDir: "e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? "github" : "list",
	use: {
		baseURL: `http://localhost:${port}`,
		trace: "retain-on-failure"
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		command: `npm run dev -- --port ${port} --strictPort`,
		url: `http://localhost:${port}`,
		env: { VITE_API_ROOT: apiRoot },
		reuseExistingServer: !process.env.CI
	}
});
