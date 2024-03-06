const [{ access }, { bcrypt }, { csrf }, { jwt }, fn] = await Promise.all([
    import("./access.js"),
    import("./bcrypt.js"),
    import("./csrf.js"),
    import("./jwt.js"),
    import("./fn.js"),
]);

export const util = {
    access,
    bcrypt,
    csrf,
    jwt,
    fn,
} as const;