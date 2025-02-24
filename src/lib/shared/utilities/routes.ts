const routes = {
    login: '/login',
    console: '/console',
    users: '/console/users',
    user: '/console/users/:id',
} as const;

type ExtractRouteParams<T extends string> =
    T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractRouteParams<`/${Rest}`>]: string }
    : T extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : object;

export function route<RouteKey extends keyof typeof routes>(
    route: RouteKey,
    ...args: keyof ExtractRouteParams<typeof routes[RouteKey]> extends never
        ? []
        : [params: ExtractRouteParams<typeof routes[RouteKey]>]
): string {
    let url = `${routes[route]}`;

    if (args.length > 0) {
        const params = args[0];
        for (const [key, value] of Object.entries(params || {}) as [string, string][]) {
            url = url.replace(`:${key}`, value);
        }
    }

    return url;
}