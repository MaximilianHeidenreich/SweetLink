//import { env } from "$env/dynamic/private";
//import { env } from "$env/dynamic/public";
// TODO: Fix env -> expose during run

export const API_HOST = import.meta.env.DEV ? "http://localhost:3055" : "/api";//"https://dev-heron-sweetforms.maximilianheidenreich.deta.app/api";