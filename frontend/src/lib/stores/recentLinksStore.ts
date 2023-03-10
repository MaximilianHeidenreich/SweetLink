import { get, writable } from "svelte/store";
import { fetchAllLinks } from "../api/links";
import type { ILink } from "../types/ILink";

export const recentLinksStore = writable<ILink[] | []>([]);
(async () => {
    if (get(recentLinksStore).length === 0) {
        recentLinksStore.set(orderLinks(await fetchAllLinks()));
    }
})();

export async function fetchRemoteRecentLinks() {
    const links = await fetchAllLinks();
    
    // TODO: Check if diff
    recentLinksStore.set(orderLinks(links));
}

export function orderLinks(links: ILink[]) {
    return links.sort((a, b) => b.timestamp - a.timestamp);
}