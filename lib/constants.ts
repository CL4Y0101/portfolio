export const SITE_URL = "https://cl4y0101.github.io/portfolio";
export const GITHUB_URL = "https://github.com/CL4Y0101";

export function withBasePath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${normalizedPath}`;
}
