import { config } from "$std/dotenv/mod.ts";
import * as Drash from "drash/mod.ts";
import { DexterService } from "drash/src/services/dexter/dexter.ts";
import { CORSService } from "drash/src/services/cors/cors.ts";

// Resources
import { AuthResource } from "@src/auth.ts";
import { TelemetryResource } from "@src/telemetry.ts"; // TODO(@max): replace with Tracy
import { LinkResource } from "@src/link.ts";

const ENV = await config({ path: "./.env.local", export: true });
const PORT = Number(Deno.env.get("PORT")) || 3055;

const dexter = new DexterService({
	url: true,
	method: true,
	response_time: true,
});
const cors = new CORSService({
    preflight: false,
	origin: ["*"], // TODO(@max): check if can be narrowed down
});


const server = new Drash.Server({
	hostname: "localhost",
	port: PORT,
	protocol: "http",
	services: [
		//cors,
		dexter,
	],
	resources: [
        LinkResource,
        AuthResource,
        TelemetryResource // TODO(@max): replace with Tracy
	],
});

server.run();
console.log(`Server running at ${server.address}.`);