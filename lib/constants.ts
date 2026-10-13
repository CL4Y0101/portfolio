export const SITE_URL = "https://adityafadni.is-a.dev";
export const GITHUB_URL = "https://github.com/CL4Y0101";

export function withBasePath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${normalizedPath}`;
}
