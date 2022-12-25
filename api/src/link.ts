import * as Drash from "drash/mod.ts";
import {
    crypto
} from "$std/crypto/mod.ts";
import { customAlphabet } from "nanoid/customAlphabet.ts";
import * as bcrypt from "bcrypt";
import { deta } from "@lib/deta.ts";
import { ParsedBody } from "drash/src/http/request.ts";
import { IError, IOk } from "@lib/IResponse.ts";
import { ILink, LinkCreateSchema } from "./lib/ILink.ts";

const db = deta.Base("links");

export class LinkResource extends Drash.Resource {
    public paths = [
        "/links/:id?"
    ];

    public async GET(
        request: Drash.Request,
        response: Drash.Response,
    ): Promise<void> {
        // Get one
        const id = request.pathParam("id");
        if (id) {
            const link = await db.get(id) as unknown as ILink;
            return response.json({ ok: true, data: link } as IOk);
        }

        const queryRaw = request.queryParam("query");
        let query: Record<string, unknown> | Record<string | number | symbol, never> = {};
        if (queryRaw) {
            try {
                query = JSON.parse(atob(queryRaw));
            }
            catch (err) {
                return response.json({ ok: false, error: "Invalid query!" } as IError, 400);
            }
        }
        
        const queryOptions: { [key: string]: unknown } = {};
        const limit = request.queryParam("limit") || 50;
        if (limit) queryOptions["limit"] = Number(limit);
        const last = request.queryParam("last") || undefined;
        if (last) queryOptions["last"] = last;

        //@ts-ignore - Deta SDK is shitting itself but we good :)
        const links = await db.fetch(query, queryOptions);
        
        return response.json({ ok: true, data: links } as IOk);
    }

    public async POST(
        request: Drash.Request, 
        response: Drash.Response
    ): Promise<void> {
        try {
            LinkCreateSchema.parse(request.bodyAll());
        }
        catch (err) {
            console.error(err);
            return response.json({ ok: false, error: err } as IError, 400);
        }

        const {
            target,
            title,
            passwordRaw,
            visitorLimit,
            collectStatistics
        } = request.bodyAll() as any; // TODO(@max): narrow type
        let { shortCode } = request.bodyAll() as any; // TODO(@max): narrow type    
        
        // Generate shortcode if not provided
        // TODO(@max): generation loop with error if not unique
        if (!shortCode) shortCode = await customAlphabet("0123456789ABCDEFGHJKLMNOPQRSTUVWXYZ_abcdefghjkmnopqrstuvwxyz-", 8)();

        // Hash password if provided
        let passwordHash: string | undefined = undefined;
        if (passwordRaw) {
            passwordHash = await bcrypt.hash(passwordRaw); // TODO(@max): check if we can reduce the cost
        }

        const link: ILink = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            target,
            title: title ? title : "",
            shortCode,
            tags: [],
            protected: passwordHash ? true : false,
            passwordHash,
            visitorLimit,
            collectStatistics,

            visitors: 0,
            visits: [],
        }

        try {
            // @ts-ignore - Deta SDK is shitting itself but its ok :)
            await db.put(link, link.id);
        }
        catch (err) {
            console.error(err);
            return response.json({ ok: false, error: err } as IError, 500);
        }
        
        return response.json({
			ok: true,
            data: link
		} as IOk, 200);
	}

    public async PATCH(
        request: Drash.Request,
        response: Drash.Response,
    ): Promise<void> {
        // Get one
        const id = request.pathParam("id") as string;
        if (!(await db.get(id))) {
            return response.json({ ok: false, error: "Link with id not found!" } as IError, 404);
        }

        const updates = request.bodyParam<unknown>("updates");

        // @ts-ignore - TODO(@max): fix
        if (updates.protected === false) {
            // @ts-ignore - TODO(@max): fix
            updates.protected = false;
        }
        // @ts-ignore - TODO(@max): fix
        else if (updates.passwordRaw) {
             // @ts-ignore - TODO(@max): fix
            updates.passwordHash = await bcrypt.hash(updates.passwordRaw); // TODO(@max): check if we can reduce the cost
        }

        // Delete key property -> Deta will error on key update
        // @ts-ignore - fix
        delete updates.key; // TODO(@max): what if not exist
        
        try {
            console.log(updates);
            
            // @ts-ignore - Deta SDK is shitting itself but we good :)
            await db.update(updates, id);
        }
        catch (err) {
            console.error(err);
            return response.json({ ok: false, error: "Could not update link!" } as IError, 500);
        }

        return response.json({ ok: true } as IOk, 200);
    }

    public async DELETE(
        request: Drash.Request,
        response: Drash.Response,
    ): Promise<void> {
        const id = request.pathParam("id");
        if (!id) {
            return response.json({ ok: false, error: "No id provided!" } as IError, 400);
        }

        try {
            // @ts-ignore - Deta SDK is shitting itself but its ok :)
            await db.delete(id);
        }
        catch (err) {
            console.error(err);
            return response.json({ ok: false, error: err } as IError, 500);
        }

        return response.json({ ok: true } as IOk, 200);
    }

}