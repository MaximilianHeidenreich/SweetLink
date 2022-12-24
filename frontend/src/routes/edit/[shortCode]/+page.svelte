<script lang="ts">
    import type { ILink } from "$src/lib/types/ILink";
    
    import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
    
    
    /** @type {import('./$types').PageData} */
    export let data;
    
    // STATE
    const link: ILink | undefined = data.link;
    
    //const fields = Object.entries(submission.fields).map(([name, value]) => ({ name, value }));
</script>

<Breadcrumb aria-label="Solid background breadcrumb example" solid>
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem>Links</BreadcrumbItem>
    <BreadcrumbItem>Google</BreadcrumbItem>
</Breadcrumb>

