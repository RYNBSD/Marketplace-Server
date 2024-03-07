const [{ default: user }] = await Promise.all([import("./user.js")]);

export default {
  user,
} as const;
