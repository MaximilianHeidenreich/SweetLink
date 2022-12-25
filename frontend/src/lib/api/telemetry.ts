import { API_HOST } from "./apiHost";

export async function countVisit(id: string): Promise<void> {
    const response = await fetch(`${API_HOST}/telemetry/${id}`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Accept": "application/json",
        },
    });    
    
    const json = await response.json();
    
    //TODO;: Error handling
    return json.data;
}