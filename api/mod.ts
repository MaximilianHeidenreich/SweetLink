import { config } from "$std/dotenv/mod.ts";
import * as Drash from "drash/mod.ts";
import { DexterService } from "drash/src/services/dexter/dexter.ts";
import { CORSService } from "drash/src/services/cors/cors.ts";

// Resources
//import { ProjectsResource } from "./src/projects.ts";
import { LinkResource } from "@src/link.ts";

const ENV = await config({ path: "./.env.local", export: true });
const PORT = Number(Deno.env.get("PORT")) || 3055;

class HomeResource extends Drash.Resource { // TODO(@max): remove this
	public paths = ["/"];

	public GET(request: Drash.Request, response: Drash.Response): void {
		return response.json({
			hello: "world",
			time: new Date(),
		});
	}
    public POST(request: Drash.Request, response: Drash.Response): void {
		return response.json({
			hello: "post"
		});
	}
}

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
		cors,
		dexter,
	],
	resources: [
		//HomeResource,
        LinkResource,
	],
});

server.run();
console.log(`Server running at ${server.address}.`);