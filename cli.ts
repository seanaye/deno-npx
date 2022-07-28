import { run } from "./src/main.ts"

if (import.meta.main) {
  await run(Deno.args)
}
