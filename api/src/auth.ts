import * as Drash from "drash/mod.ts";
import * as bcrypt from "bcrypt";
import { deta } from "@lib/deta.ts";
import { IError, IOk } from "@lib/IResponse.ts";
import { ILink } from "./lib/ILink.ts";

const db = deta.Base("links");

export class AuthResource extends Drash.Resource {
    public paths = [
        "/auth/:id?"
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

        const passwordRaw = request.bodyParam<string>("passwordRaw");
        if (!passwordRaw) {
            return response.json({ ok: false, error: "No passwordRaw body attribute provided!" } as IError, 400);
        }

        const link = await db.get(id) as unknown as ILink;
        if (!link) {
            return response.json({ ok: false, error: "Link not found!" } as IError, 404);
        }

        const result = await bcrypt.compare(passwordRaw, link.passwordHash!);

        if (result) return response.json({ ok: true, data: link } as IOk, 200);
        else return response.json({ ok: false, error: "Unauthorized!" } as IError, 401);
    }

}