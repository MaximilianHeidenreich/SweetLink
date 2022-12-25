<script lang="ts">
	import { patchLink } from "$src/lib/api/links";

    import type { ILink } from "$src/lib/types/ILink";

    import { 
        Badge, 
        Button, 
        ButtonGroup, 
        Input, 
        Label, 
        Checkbox, 
        Tooltip, 
        Modal,
		Hr,
		Toggle
    } from "flowbite-svelte";
	import { HashIcon, KeyIcon, LinkIcon, TagIcon, TypeIcon, UsersIcon } from "svelte-feathers";

    // PROPS
    export let link: ILink | undefined;
    export let visible = false;

    // STATE
    let tagsInput = link?.tags?.join(", ") ?? "";
    const tags = () => tagsInput.split(",").map((t) => t.trim()).filter((t) => t !== "");

    $: passwordProtectedActive = !link?.protected;
    let password = "";

    let limitUniqueVisitors: boolean = link?.visitorLimit !== undefined && (link!.visitorLimit !== 0);
    $: limitUniqueVisitorsActive = !limitUniqueVisitors;
    let uniqueVisitorLimit = link?.visitorLimit;

    let collectStatistics = link?.collectStatistics;

    // ACTIONS
    async function onSubmitChanges() {
        console.log(tagsInput);
        console.log(tags());
        
        
        await patchLink(link!.id, {
            title: link!.title,
            shortCode: link!.shortCode,
            target: link!.target,
            tags: tags(),
            // @ts-ignore - TODO(@max): fix
            passwordRaw: link?.protected ? password : undefined,
            visitorLimit: limitUniqueVisitors ? Number(uniqueVisitorLimit) : undefined,
            collectStatistics
        })
    }

</script>

<Modal bind:open={visible} size="md" title="Edit Link" autoclose>
    {#if !link}
    <div class="text-center">
        <p>No link provided!</p>
    </div>
    {:else}
    <form class="flex flex-col space-y-6" on:submit|preventDefault={() => {}}>
        <div class="flex items-center justify-between gap-6">
            <Label class="space-y-2 w-full">
                <span>Title</span>
                <Input type="text" name="title" bind:value={link.title}>
                    <TypeIcon slot="left" size="16"/>
                </Input>
            </Label>
            <Label class="space-y-2 w-full">
                <span>ShortCode</span>
                <Input type="text" name="shortCode" bind:value={link.shortCode} required>
                    <HashIcon slot="left" size="16"/>
                </Input>
            </Label>
        </div>
        <Label class="space-y-2">
            <span>Target URL</span>
            <Input type="url" name="targetURL" bind:value={link.target} required>
                <LinkIcon slot="left" size="14" />
            </Input>
        </Label>
        <Label class="space-y-2">
            <span>Tags <small>(comma separated)</small></span>
            <Input type="text" name="tags" bind:value={tagsInput} placeholder="project a, TagB">
                <TagIcon slot="left" size="14" />
            </Input>
        </Label>
        <div class="my-6"><Hr>Utilities</Hr></div>
        <div class="flex items-end justify-between gap-6">
            <Toggle bind:checked={link.protected} color="purple" class="flex-1 shrink-0 w-1/2 min-w-max mb-2.5">Password protected</Toggle>
            <Label class="space-y-2 w-1/2">
                <span>Password</span>
                <Input id="password" type="text" placeholder="New Password" bind:value={password} bind:disabled={passwordProtectedActive}>
                    <KeyIcon slot="left" size="16"/>
                </Input>
            </Label>
        </div>
        <div class="flex items-end justify-between gap-6">
            <Toggle bind:checked={limitUniqueVisitors} color="purple" class="flex-1 shrink-0 w-1/2 min-w-max mb-2.5">Limit unique visitors</Toggle>
            <Label class="space-y-2 w-1/2">
                <span>Visitor Limit</span>
                <Input id="limitUniqueVisitors" type="number" bind:value={uniqueVisitorLimit} bind:disabled={limitUniqueVisitorsActive}>
                    <UsersIcon slot="left" size="16"/>
                </Input>
            </Label>
        </div>
        <div class="flex items-end justify-between gap-6">
            <Toggle bind:checked={collectStatistics} color="purple" class="flex-1 shrink-0 w-1/2 min-w-max mb-2.5">Collect statistics</Toggle>
        </div>
        
        <Button on:click={onSubmitChanges}>Save</Button>
    </form>
    {/if}
</Modal>
