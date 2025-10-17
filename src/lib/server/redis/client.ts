import { REDIS_URL } from "$env/static/private";
import { createClient } from "redis";

export const redisClient = await createClient({
    url: REDIS_URL,
    socket: {
        reconnectStrategy() {
            return false;
        },
    }
}).on("error", () => { })

export const getCache = async (key: string): Promise<string | null | undefined> => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        const res = await redisClient?.get(key);
        return res;
    }
    catch {
        console.log(`[REDIS] Error while getting cache for key: ${key}`)
        return null;
    }
};

export const setCache = async (key: string, value: string): Promise<void> => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
        await redisClient?.set(key, value);
    }
    catch {
        console.log(`[REDIS] Error while setting cache for key: ${key}`)
    }
};