const [{ default: auth }, { default: user }] = await Promise.all([
  import("./auth.js"),
  import("./user.js"),
]);

export default {
  auth,
  user,
} as const;
