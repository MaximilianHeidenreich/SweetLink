<script>

    import { Toaster } from "svelte-french-toast";
    import { Modals, closeModal } from "svelte-modals";
    import "../styles.css";

    import "../app.pcss";
	import Footer from "$src/components/core/Footer.svelte";
	
	/*import Navigation from "$src/components/core/Navigation.svelte";
	import Sidebar from "$src/components/core/Sidebar.svelte";
	import Header from "$src/components/core/Header.svelte";*/

</script>

<Toaster/>
<main>
    <slot />
</main>

<Footer/>

<!--<Modals>
    <!-- svelte-ignore a11y-click-events-have-key-events 
    <div slot="backdrop" class="modal-backdrop" on:click={closeModal} />
</Modals>
<div>
    <Sidebar />
    <main>
        <Header />
        <slot />
    </main>
</div>

<div class="flex justify-start items-stretch gap-4">
    <Sidebar />
    <slot />
</div>-->

<style lang="postcss">
    /*div {
        @apply flex items-stretch;
        @apply w-full h-full overflow-hidden;
    }
    .modal-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 100;
        background: rgba(0,0,0,0.25)
    }*/
</style>