<script lang="ts">
	import { createLink } from "$src/lib/api/links";
	import { fetchRemoteRecentLinks, orderLinks, recentLinksStore } from "$src/lib/stores/recentLinksStore";
	import toastOptions from "$src/lib/toast";

    import { Label, Button, ButtonGroup, Input, InputAddon, Popover, Toggle, Spinner, Hr, Helper } from "flowbite-svelte";
    import { LinkIcon, ArrowRightIcon, SettingsIcon, KeyIcon, UsersIcon, HashIcon, TypeIcon } from "svelte-feathers";
	import toast from "svelte-french-toast";

    // STATE
    let targetURL = "";
    let customTitle = "";
    let customShortCode = "";

    let passwordProtected = false;
    let password = "";

    let limitUniqueVisitors = false;
    let limitUniqueVisitorsCount = 0;

    let collectStatistics = true;

    let submitting = false; // used for loading state

    // ACTIONS
    async function submitForm() {
        const p = async () => {
            const newLink = await createLink({
                target: targetURL,
                title: customTitle !== "" ? customTitle : undefined,
                shortCode: customShortCode !== "" ? customShortCode : undefined,
                passwordRaw: passwordProtected ? password : undefined,
                visitorLimit: limitUniqueVisitors ? Number(limitUniqueVisitorsCount) : undefined,
                collectStatistics
            })
            recentLinksStore.update((links) => {
                const nL = [...links, newLink];
                return orderLinks(nL);
            })

            // Reset form
            targetURL = "";
            customTitle = "";
            customShortCode = "";
            passwordProtected = false;
            password = "";
            limitUniqueVisitors = false;
            limitUniqueVisitorsCount = 0;
            collectStatistics = true;

            submitting = false;
        }
        submitting = true;
        toast.promise(
            p(),
            {
                loading: "Creating link...",
                success: "Link created!",
                error: "Could not create link!",
            },
            toastOptions()
        );
    }
</script>

<form class="mt-4 max-w-2xl mx-auto" on:submit|preventDefault={submitForm}>
    <!--<Label for="input-addon" class="mb-2">Destination</Label>-->
    <ButtonGroup class="w-full">
        <InputAddon><LinkIcon color="black" size="14" /></InputAddon>
        <Input id="targetUrl" type="url" placeholder="https://www.example.com/page" bind:value={targetURL} required/>
        <Button color="light" id="settings"><SettingsIcon size="16"/></Button>
        <Button color="purple" type="submit" disabled={submitting}>Create <ArrowRightIcon size="16" class="ml-1.5"/></Button>
    </ButtonGroup>
    <Popover 
        triggeredBy="#settings" 
        placement={"bottom"} 
        trigger="click" 
        title="Link Settings" 
        class="min-w-[40ch] text-sm font-light text-gray-500 bg-white dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
        >
        <div class="px-3 py-0">
            <form>
                <fieldset class="!mt-0">
                    <Label for="shortCode" class="block my-2">Title</Label> <!-- TODO: Add preview for active domain-->
                    <Input id="shortCode" type="text" bind:value={customTitle} placeholder="Cool Page">
                        <TypeIcon slot="left" size="16"/>
                        <!--<svg slot="left" aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                            -->
                    </Input>
                </fieldset>
                <fieldset>
                    <Label for="shortCode" class="block my-2">Custom shortCode</Label> <!-- TODO: Add preview for active domain-->
                    <Input id="shortCode" type="text" bind:value={customShortCode}>
                        <HashIcon slot="left" size="16"/>
                        <!--<svg slot="left" aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                            -->
                    </Input>
                </fieldset>
                <div class="my-6"><Hr>Utilities</Hr></div>
                <fieldset>
                    <Toggle bind:checked={passwordProtected} color="purple">Password protected</Toggle>
                    {#if passwordProtected}
                    <Label for="password" class="block my-2">Password</Label>
                    <Input id="password" type="text" bind:value={password}>
                        <KeyIcon slot="left" size="16"/>
                        <!--<svg slot="left" aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                            -->
                    </Input>
                    {/if}
                </fieldset>
                <fieldset>
                    <Toggle bind:checked={limitUniqueVisitors} color="purple">Limit unique visitors</Toggle>
                    {#if limitUniqueVisitors}
                    <Label for="limitUniqueVisitorsCount" class="block my-2">Max. visitors</Label>
                    <Input id="limitUniqueVisitorsCount" type="number" bind:value={limitUniqueVisitorsCount}>
                        <UsersIcon slot="left" size="16"/>
                        <!--<svg slot="left" aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                            -->
                    </Input>
                    {/if}
                </fieldset>
                <fieldset>
                    <Toggle color="purple">Add tracking UTMs</Toggle>
                    <Helper helperClass="mt-1">Not implemented yet!</Helper>
                </fieldset>
                <fieldset>
                    <Toggle bind:checked={collectStatistics} color="purple">Collect statistics</Toggle>
                    <Helper helperClass="mt-1">Not implemented yet!</Helper>
                </fieldset>
            </form>

<!--            <div class="flex justify-between items-center mb-2">
            <Button size="xs">Follow</Button>
            </div>
            <div class="text-base font-semibold leading-none text-gray-900 dark:text-white">
            <a href="/">Jese Leos</a>
            </div>
            <div class="mb-3 text-sm font-normal">
            <a href="/" class="hover:underline">@jeseleos</a>
            </div>
            <div class="mb-4 text-sm font-light">Open-source contributor. Building <a href="/" class="text-blue-600 dark:text-blue-500 hover:underline">flowbite.com</a>.</div>
            <ul class="flex text-sm font-light">
            <li class="mr-2">
                <a href="/" class="hover:underline">
                    <span class="font-semibold text-gray-900 dark:text-white">799</span>
                    <span>Following</span>
                </a>
            </li>
            <li>
                <a href="/" class="hover:underline">
                    <span class="font-semibold text-gray-900 dark:text-white">3,758</span>
                    <span>Followers</span>
                </a>
            </li>
            </ul>-->
        </div>
        </Popover>
</form>

<style lang="postcss">
    form {
        @apply my-2;
    }
    form fieldset {
        @apply my-4;
    }
</style>