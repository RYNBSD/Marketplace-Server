const [{ default: user }, { default: store }] = await Promise.all([import("./user.js"), import("./store.js")]);

export default {
  user,
  store,
} as const;
