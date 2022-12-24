<script lang="ts">
	import { deleteLink } from "$src/lib/api/links";

	import { fetchRemoteRecentLinks, orderLinks, recentLinksStore } from "$src/lib/stores/recentLinksStore";
	import toastOptions from "$src/lib/toast";

	import type { ILink } from "$src/lib/types/ILink";

    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Badge, Button, ButtonGroup } from "flowbite-svelte";
	import toast from "svelte-french-toast";

    // STATE
    /*const links: ILink[] = [
        { id: "uasdu-ad2-asd2-sd", title: "Google Page", target: "https://www.google.de/page2", timestamp: 2213, shortCode: "customShort" },
        { id: "bbsdu-av2-asd2-sd", title: "cool YouTUbe video", target: "https://www.youtube.com/?watch=yqqpa8372_asd", timestamp: 2213, shortCode: "x2AkUts" },
    ]*/

    $: links = orderLinks($recentLinksStore);

    // ACTIONS
    function extractTargetFromURL(url: string): string {
        const urlObject = new URL(url);
        return urlObject.hostname;
    }
    function onDeleteLink(link: ILink) {
        const con = confirm("asd");    // TODO(@max): Custom modal
        if (con) {
            const p = async () => {
                await deleteLink(link.id);
                recentLinksStore.update((links) => links.filter((l) => l.id !== link.id));  // TODO: only when successful
            }
            toast.promise(
                p(),
                {
                    loading: "Deleting link...",
                    success: "Link deleted!",
                    error: "Could not delete link!",
                },
                toastOptions()
            );
        }
    }
</script>

<Table striped={true} shadow>
    <TableHead theadClass="bg-gray-100">
        <TableHeadCell>Title</TableHeadCell>
        <TableHeadCell>Target</TableHeadCell>
        <TableHeadCell>
            Shortcode
            <button id="b3"> <!-- TODO: make right + popover-->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 ml-1"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" /></svg>
            <span class="sr-only">Show information</span></button>
        </TableHeadCell>
        <TableHeadCell>Clicks</TableHeadCell>
        <TableHeadCell>
            <span class="sr-only"> Actions </span>
        </TableHeadCell>
    </TableHead>
    <TableBody class="divide-y">
        {#each links as link}
            <TableBodyRow>
                <TableBodyCell>{link.title}</TableBodyCell>
                <TableBodyCell><Badge large={true} color="dark">{extractTargetFromURL(link.target)}</Badge></TableBodyCell>
                <TableBodyCell on:click={() => alert("TODO: Copy link")}><Badge href="/" large={true}>{link.shortCode}</Badge></TableBodyCell>
                <TableBodyCell>{2}</TableBodyCell>
                <TableBodyCell>
                    <ButtonGroup>
                        <Button href="/edit/{link.id}">Edit</Button>
                        <Button href="/analytics/{link.id}">Analytics</Button>
                        <Button color="red" on:click={() => onDeleteLink(link)}>Delete</Button>
                    </ButtonGroup>
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>