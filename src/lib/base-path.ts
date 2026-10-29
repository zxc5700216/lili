/** Must match next.config.ts basePath. Client fetch/form/redirects do not auto-prefix. */
export const BASE_PATH = "/lili";

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return `${BASE_PATH}/${path}`;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}
