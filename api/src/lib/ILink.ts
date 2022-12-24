import { z } from "zod";
import { IVisit } from "./IVisit.ts";

/**
 * Database entry representing a shortend url.
 * 
 * @property id - The key uuid of the entry.
 * @property timestamp - UNIX epoch timestamp the entry was created.
 * @property title - Custom title of the link target.
 * @property target - The target url.
 * @property shortId - The short code of the entry used to access the entry.
 */
export interface ILink {
    id: string;
    timestamp: number;

    title?: string;
    target: string;
    shortCode: string;

    passwordHash?: string;
    visitorLimit?: number;
    collectStatistics: boolean;

    // Dynamics - updated on access
    visitors: number;
    visits: IVisit[];
}

export const LinkSchema = z.object({
    id: z.string().uuid(),
    timestamp: z.number().int(),

    title: z.string().max(25).optional(),
    target: z.string().url(),
    shortCode: z.string().max(15),
}).strict();

export const LinkCreateSchema = z.object({
    title: z.string().max(25).optional(),
    target: z.string().url(),
    shortCode: z.string().max(15).optional(),

    passwordRaw: z.string().optional(),
    visitorLimit: z.number().int().optional(),
    collectStatistics: z.boolean(),
}).strict();