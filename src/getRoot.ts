import { ResultAsync, err, ok } from "../deps.ts";

export async function getRoot(filename: string, start: URL) {
  for await (const dir of walkUpwards(start)) {
    const fileUrl = new URL(filename, dir);
    const res = await ResultAsync<string, Error>.fromPromise(
      Deno.readTextFile(fileUrl),
      (e: Error) => e,
    );
    if (res.isOk()) {
      return ok({ inDir: dir, value: res.value })
    }
  }
  return err(new Error('Could not find root file'))
}

export async function* walkUpwards(start: URL) {
  const root = new URL("file:///");
  let cur = start;
  while (root.toString() !== cur.toString()) {
    yield cur;
    cur = new URL("../", cur);
  }
}
