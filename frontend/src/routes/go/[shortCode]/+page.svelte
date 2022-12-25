<script lang="ts">
	import { goto } from "$app/navigation";

    import AppTitle from "$src/components/core/AppTitle.svelte";
	import { authorizeLink } from "$src/lib/api/links";
	import { countVisit } from "$src/lib/api/telemetry";
	import toastOptions from "$src/lib/toast";
    import type { ILink } from "$src/lib/types/ILink";
    
    import { Button, ButtonGroup, Input, InputAddon, Label, Alert, Helper, P, A } from "flowbite-svelte";
	import { onMount } from "svelte";
    import { KeyIcon, EyeIcon, EyeOffIcon, ArrowRightIcon, Link2Icon } from "svelte-feathers";
	import toast from "svelte-french-toast";
    
    /** @type {import('./$types').PageData} */
    export let data;
    
    // STATE
    const link: ILink = data.link;
    let targetURL: string | undefined;  // Fetched from api when link is password protected

    let password = "";
    let passwordVisible = false;

    let submitting = false;
    let wrongPassword = false;

    // ACTIONS
    async function submitPasswordForm() {
        const res = await authorizeLink(link.id, password);
        if (res) {
            // TODO: visual success
            document.location = res.target;
            //await goto(res.target, { replaceState: true })
        }
        else {
            toast.error("Wrong password!", toastOptions());
            password = "";
            wrongPassword = true;
        }
    }

    // Collect statistics
    // TODO(@max): Impl
    onMount(async () => {
        await countVisit(link.id);
        
        if (!link.protected && ((link.visitorLimit && link.visitors < link.visitorLimit) || !link.visitorLimit)) document.location = link.target;//await goto(link.target, { replaceState: true });
    });
    
</script>

<AppTitle />

{#if link.protected}
<section class="max-w-lg mx-auto">
    <Alert>
        <span slot="icon">
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
        </span>
        <span class="font-medium">This link is protected!</span> Please enter the password to continue.
    </Alert>
    <form on:submit|preventDefault={submitPasswordForm}>
        <fieldset>
            <Label for="password" class="block my-2">Password</Label>
            <ButtonGroup class="w-full">
                <InputAddon><KeyIcon color="black" size="14" /></InputAddon>
                <Input id="password" color={wrongPassword ? 'red' : 'base'} type="{passwordVisible ? 'text' : 'password'}" bind:value={password} required/>
                <Button color="light" id="settings" on:click={() => passwordVisible = !passwordVisible}>
                    {#if passwordVisible}
                    <EyeOffIcon size="16"/>
                    {:else}
                    <EyeIcon size="16"/>
                    {/if}
                </Button>
                <Button color="dark" type="submit" disabled={submitting}>Submit <ArrowRightIcon size="16" class="ml-1.5"/></Button>
            </ButtonGroup>
            {#if wrongPassword}<Helper class="mt-2" color="red">Wrong password!</Helper>{/if}
            <!--<Input id="password" type="text" bind:value={password}>
                <KeyIcon slot="left" size="16"/>

            </Input>-->
        </fieldset>
    </form>
</section>
{/if}
{#if link.visitorLimit && link.visitors >= link.visitorLimit}
<section class="max-w-lg mx-auto">
    <Alert>
        <span slot="icon">
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
        </span>
        <span class="font-medium">Visitor limit reached!</span> This link was only able to be visited {link.visitorLimit} times!
    </Alert>
</section>
{/if}
{#if !link.protected}
    {#if (link.visitorLimit && link.visitors < link.visitorLimit) || !link.visitorLimit}
    <section class="max-w-lg mx-auto">
        <P class="text-center" size="lg" weight="semibold" height="loose">Redirecting...</P>
        <P class="text-center" size="sm">If you are not redirected automatically within 5 seconds, <A><span on:click={() => document.location = link.target}>click here</span></A>.</P>
    </section>
    {/if}
{/if}

<style lang="postcss">
    form {
        @apply my-2;
    }
    form fieldset {
        @apply my-4;
    }
</style>
