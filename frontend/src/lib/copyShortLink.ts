import toast from "svelte-french-toast";
import toastOptions from "./toast";

export async function copyShortLink(shortCode: string) {
    const link = `${window.location.origin}/go/${shortCode}`;
    await navigator.clipboard.writeText(link);
    toast.success("Copied short link to clipboard", toastOptions());
}