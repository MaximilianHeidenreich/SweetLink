<script lang="ts">
	import AppTitle from "$src/components/core/AppTitle.svelte";

	import RecentLinks from "$src/components/core/RecentLinks.svelte";
    import ShortenerForm from "$src/components/core/ShortenerForm.svelte";

    import { Hr } from "flowbite-svelte";

</script>

<AppTitle />
<ShortenerForm />

<Hr class="my-12" height="h-px">Latest Links</Hr>

<RecentLinks />
