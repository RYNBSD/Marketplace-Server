export const [{ default: ENV }, { default: KEYS }, { default: VALUES }, ENUM] =
  await Promise.all([
    import("./env.js"),
    import("./keys.js"),
    import("./values.js"),
    import("./enum.js"),
  ]);
