
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
}
