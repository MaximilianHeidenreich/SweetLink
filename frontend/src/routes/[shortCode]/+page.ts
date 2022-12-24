import { fetchLinkByShortCode } from '$src/lib/api/links';
import type { ILink } from '$src/lib/types/ILink';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
// @ts-ignore TODO: fix
export async function load({ params }) {
    const shortCode = params.shortCode;

    //const submission = fetchSubmission(id);
    //throw error(404, 'Not found');
    const link: ILink | undefined = await fetchLinkByShortCode(shortCode);

    if (link) {
        if (!link.passwordHash && !link.collectStatistics) {
            throw redirect(302, link.target);
        }
    }
    else {
        throw error(404, 'Not found');
    }

    // Strip private data
    link.passwordHash = "hackyHacky";   // We don't want to leak the password hash, but reuse the property to indicate a password is needed to the frontend.

    return {
        link
    }
}