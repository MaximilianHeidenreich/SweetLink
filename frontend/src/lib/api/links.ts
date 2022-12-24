import type { ILink } from "../types/ILink";
import { API_HOST } from "./apiHost";

/**
 * Generator to fetch links.
 * @param limit Max number of link to fetch at once
 */
export async function *fetchLinks(limit: number = 20, query: unknown) {
    let last = undefined;

    const request = async (lastKey: string | undefined, query: unknown | undefined): Promise<{ count: number, last: string | undefined, items: unknown[] }> => {
        let uri = `${API_HOST}/links?limit=${limit}`
        if (lastKey) uri += `&last=${lastKey}`;
        if (query) uri += `&query=${btoa(JSON.stringify(query))}`;
        
        const response = await fetch(uri, {
            method: "GET"
        });
        const json = await response.json();
        
        last = json.data.last;
        return json.data;
    }

    yield await request(last, query);
    while (last) {
        yield await request(last, query);
    }
}
export async function fetchAllLinks(query?: unknown) {
    const links: ILink[] = [];
    for await (const res of fetchLinks(100, query)) {
        links.push(...res.items as ILink[]);
    }
    
    const p = new Promise<ILink[]>((resolve, reject) => {
        setTimeout(() => {
            resolve(links);
        }, 1000) // TODO: REMOVE!!!
    })
    return p//orms; // TODO(@max): remove!?
}

/**
 * Get one link by ID.
 * @param id The ID of the link to fetch
 * @returns 
 */
export async function fetchLinkById(id: string) {
    const response = await fetch(`${API_HOST}/links/${id}`, {
        method: "GET"
    });
    const json = await response.json();
    //TODO;: Error handling
    return json.data;
}
/**
 * Get one link by its short code.
 * @param shortCode The shortCode of the link to fetch
 * @returns 
 */
export async function fetchLinkByShortCode(shortCode: string) {
    const query = { "shortCode": shortCode }
    const response = await fetch(`${API_HOST}/links?query=${btoa(JSON.stringify(query))}`, {
        method: "GET"
    });
    
    const json = await response.json();
    //TODO;: Error handling
    return json.data.items[0];
}

export interface ICreateLink {
    title?: string;
    target: string;
    shortCode?: string;
    passwordRaw?: string;
    visitorLimit?: number;
    collectStatistics: boolean;
}
export async function createLink(link: ICreateLink): Promise<ILink> {
    const response = await fetch(`${API_HOST}/links`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(link),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Accept": "application/json",
        },
    });    
    
    const json = await response.json();
    console.log("resp json", json);
    
    //TODO;: Error handling
    return json.data;
}

export async function patchLink(id: string, updates: Partial<ILink>) {
    const response = await fetch(`${API_HOST}/links/${id}`, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify({
            updates
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Accept": "application/json",
        },
    });    
    
    const json = await response.json();
    console.log("resp json", json);
    
    //TODO;: Error handling
    return json.data;
}

export async function deleteLink(id: string) {
    const response = await fetch(`${API_HOST}/links/${id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Accept": "application/json",
        },
    });    
    
    const json = await response.json();
    console.log("resp json", json);
    
    //TODO;: Error handling
    return json.data;
}