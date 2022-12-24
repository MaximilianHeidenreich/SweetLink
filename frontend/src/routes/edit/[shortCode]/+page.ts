//import { fetchSubmission } from '$src/lib/api/submissions';
import type { ILink } from '$src/lib/types/ILink';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
// @ts-ignore TODO: fix
export async function load({ params }) {
    const shortCode = params.shortCode;

    //const submission = fetchSubmission(id);
    //throw error(404, 'Not found');
    const link: ILink | undefined = undefined;

    return {
        link
    }
}