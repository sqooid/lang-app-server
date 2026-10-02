import { defineConfig } from "cf/config";

/**
 * Secret-like files were detected but not read or migrated: .env. Only `secrets.required` entries are migrated.
 * @see https://developers.cloudflare.com/workers/configuration/secrets/
 */

export default defineConfig({
	worker: {
		name: "lang-app",
		compatibilityDate: "2026-06-05",
		compatibilityFlags: [
			"nodejs_compat",
		],
		entrypoint: "src/index.ts",
		observability: {
			enabled: true,
			headSamplingRate: 1,
		},
		domains: [
			"echolearn-api.thesqooid.com",
		],
	},
});
