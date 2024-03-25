import Token from "csrf";

export const csrf = {
  generate() {
    const token = new Token();
    const secret = token.secretSync();

    return {
      token: token.create(secret),
      secret,
    };
  },
  verify: (secret: string, token: string) => new Token().verify(secret, token),
} as const;
