<script lang="ts">
	import { deleteLink } from "$src/lib/api/links";
	import { copyShortLink } from "$src/lib/copyShortLink";

	import { fetchRemoteRecentLinks, orderLinks, recentLinksStore } from "$src/lib/stores/recentLinksStore";
	import toastOptions from "$src/lib/toast";

	import type { ILink } from "$src/lib/types/ILink";

    import { 
        Table, 
        TableBody, 
        TableBodyCell, 
        TableBodyRow, 
        TableHead, 
        TableHeadCell, 
        Badge, 
        Button, 
        ButtonGroup, 
        Tooltip, 
        Modal
    } from "flowbite-svelte";
	import toast from "svelte-french-toast";
	import EditLinkModal from "../modals/EditLinkModal.svelte";

    // STATE
    $: links = orderLinks($recentLinksStore);

    let modalDeleteVisible = false;
    let modalDeleteLink: ILink | undefined;

    let modalEditVisible = false;
    let modalEditLink: ILink | undefined;

    // ACTIONS
    function extractTargetFromURL(url: string): string {
        const urlObject = new URL(url);
        return urlObject.hostname;
    }
    function onDeleteLink(link: ILink | undefined) {
        if (!link) return;
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
</script>

<Modal bind:open={modalDeleteVisible} size="xs" title="Delete Link" autoclose>
    <div class="text-center">
        <svg aria-hidden="true" class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this link?
        </h3>
        <Button color="red" class="mr-2" on:click={() => onDeleteLink(modalDeleteLink)}>Yes, I'm sure</Button>
        <Button color="alternative" on:click={() => modalDeleteVisible = false}>No, cancel</Button>
    </div>
</Modal>

{#key modalEditLink}
<EditLinkModal bind:visible={modalEditVisible} link={modalEditLink} />
{/key}

<Table striped={true} shadow>
    <TableHead theadClass="bg-gray-100">
        <TableHeadCell>Title</TableHeadCell>
        <TableHeadCell>Target</TableHeadCell>
        <TableHeadCell>
            Shortcode
        </TableHeadCell>
        <TableHeadCell>Tags</TableHeadCell>
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
                <TableBodyCell>
                    {#if link.tags}
                    <div class="flex flex-wrap justify-start items-start gap-2">
                        {#each link.tags as tag}
                            <Badge color="indigo">{tag}</Badge>
                        {/each}
                    </div>
                    {/if}
                </TableBodyCell>
                <TableBodyCell>{link.visitors}</TableBodyCell>
                <TableBodyCell>
                    <ButtonGroup>
                        <Button on:click={() => { modalEditLink = link; modalEditVisible = true; }}>Edit</Button>
                        <Button href="/analytics/{link.id}">Analytics</Button>
                        <Button color="red" on:click={() => { modalDeleteLink = link; modalDeleteVisible = true; }}>Delete</Button>
                    </ButtonGroup>
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>