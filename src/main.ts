import { getRoot } from "./getRoot.ts";
import { cleanupResources, templatePackageJson, writePackageJson } from "./templatePackage.ts";
import { parse } from "../deps.ts"

export async function run(args: string[]) {
  const denoConfig = await getRoot("deno.json", new URL(`${Deno.cwd()}/`, "file://"))
  if (denoConfig.isErr()) {
    console.error("Could not find root dir")
    Deno.exit()
  }

  Deno.chdir(denoConfig.value.inDir)

  await writePackageJson(denoConfig.value.inDir, templatePackageJson(denoConfig.value.value))
  // install the packages
  const installation = Deno.run({ cmd: ["npm", "i"]})
  const status = await installation.status()
  if (!status.success) Deno.exit()

  // find where npx has been called
  const sliceFrom = args.indexOf("npx")
  if (sliceFrom === -1) {
    console.error(`Unable to parse cli flags. Expected array containing "npx", received ${args}`)
    Deno.exit()
  }

  const cmd = args.slice(sliceFrom)
  console.log(cmd)
  const process = Deno.run({ cmd })
  
  await process.status()

  // cleanup package.json and node_modules
  await cleanupResources(denoConfig.value.inDir)
}

