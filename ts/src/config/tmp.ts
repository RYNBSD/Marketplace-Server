import tmp from "tmp-promise";

export default {
  async initTmpDir() {
    global.tmp = await tmp.dir({ unsafeCleanup: true });
  },
} as const;
