import { sveltekit } from '@sveltejs/kit/vite';
import path from "path";

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
    optimizeDeps: {
        include: ["highlight.js", "highlight.js/lib/core"],
    },
    resolve: {
        alias: {
            $src: path.resolve("./src"),
            $lib: path.resolve("./src/lib"),
        }
    },
    server: {
        cors: {
            origin: "*",
        }
    }
};

export default config;
