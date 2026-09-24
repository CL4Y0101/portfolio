import { copyFile, mkdir, readdir } from "node:fs/promises";
import { basename, join } from "node:path";

// GitHub Pages serves the exported .html routes without a trailing slash.
// Keep the previously published /projects/:slug/ URLs working as aliases.
const projectsDir = join(process.cwd(), "out", "projects");
const entries = await readdir(projectsDir, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith(".html")) continue;

  const slug = basename(entry.name, ".html");
  const aliasDir = join(projectsDir, slug);
  await mkdir(aliasDir, { recursive: true });
  await copyFile(join(projectsDir, entry.name), join(aliasDir, "index.html"));
}
