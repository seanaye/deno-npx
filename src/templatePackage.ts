export function templatePackageJson(denoConfig: string) {
  const config = JSON.parse(denoConfig);
  const deps: Record<string, unknown> | undefined = config?.npx?.dependencies;
  if (!deps) {
    console.warn(`Could not find dependencies in deno config npx.dependencies`);
    return null;
  }
  return `{
        "name": "tempPackage",
        "version": "0.0.0",
        "dependencies": ${JSON.stringify(deps)}
      }`;
}

export async function writePackageJson(
  directory: URL,
  contents: string | null,
) {
  if (!contents) {
    console.warn(`Skipping package.json write`);
    return;
  }
  await Deno.writeTextFile(new URL("./package.json", directory), contents);
}

/** Attempts to delete the package.json and node_modules in a given directory */
export async function cleanupResources(
  directory: URL
) {
  const p = new URL("./package.json", directory)
  const pLock = new URL("./package-lock.json", directory)
  const node_modules = new URL("./node_modules", directory)
  return await Promise.all([
    Deno.remove(p),
    Deno.remove(pLock),
    Deno.remove(node_modules, { recursive: true })
  ])
}

