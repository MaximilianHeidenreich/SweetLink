import * as Drash from "drash/mod.ts";
import * as bcrypt from "bcrypt";
import { deta } from "@lib/deta.ts";
import { IError, IOk } from "@lib/IResponse.ts";
import { ILink } from "./lib/ILink.ts";

const db = deta.Base("links");

export class TelemetryResource extends Drash.Resource {
    public paths = [
        "/telemetry/:id?"
    ];

    public async POST(
        request: Drash.Request,
        response: Drash.Response,
    ): Promise<void> {
        // Get link
        const id = request.pathParam("id");
        if (!id) {
            return response.json({ ok: false, error: "No id provided!" } as IError, 400);
        }

        const link = await db.get(id) as unknown as ILink;
        if (!link) {
            return response.json({ ok: false, error: "Link not found!" } as IError, 404);
        }

        // Increment visits
        try {
            await db.update({
                visitors: db.util.increment(1)
            }, id);
        }
        catch (err) {
            console.error(err);
            return response.json({ ok: false, error: "Failed to collect telemetry!" } as IError, 500);
        }

        //const action = request.bodyParam<string>("action");

        /*if (action === "visit") {
            const { zrs } = request.bodyAll(); // TODO: add telemetry details

            // Increment visits
            try {
                await db.update({
                    visits: db.util.increment(1)
                }, id);
            }
            catch (err) {
                console.error(err);
                return response.json({ ok: false, error: "Failed to collect telemetry!" } as IError, 500);
            }
        }*/

        return response.json({ ok: true } as IOk, 200);
    }

}