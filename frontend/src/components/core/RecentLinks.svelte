<script lang="ts">
	import { deleteLink } from "$src/lib/api/links";
	import { copyShortLink } from "$src/lib/copyShortLink";

	import { fetchRemoteRecentLinks, orderLinks, recentLinksStore } from "$src/lib/stores/recentLinksStore";
	import toastOptions from "$src/lib/toast";

	import type { ILink } from "$src/lib/types/ILink";

    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Badge, Button, ButtonGroup, Tooltip } from "flowbite-svelte";
	import toast from "svelte-french-toast";

    // STATE
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
        </TableHeadCell>
        <TableHeadCell>Clicks</TableHeadCell>
        <TableHeadCell>
            Actions
        </TableHeadCell>
    </TableHead>
    <TableBody class="divide-y">
        {#each links as link}
            <TableBodyRow>
                <TableBodyCell>{link.title}</TableBodyCell>
                <TableBodyCell>
                    <Badge large={true} color="dark">{extractTargetFromURL(link.target)}</Badge>
                    <Tooltip style="dark">{link.target}</Tooltip>
                </TableBodyCell>
                <TableBodyCell on:click={() => copyShortLink(link.shortCode)}>
                    <Badge href="/" large={true}>{link.shortCode}</Badge>
                    <Tooltip style="dark">Click to copy short link.</Tooltip>
                </TableBodyCell>
                <TableBodyCell>{link.visitors}</TableBodyCell>
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