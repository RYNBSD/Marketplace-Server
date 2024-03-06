import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
import { schema } from "../schema/index.js";
import { APIError } from "../error/index.js";
import { StatusCodes } from "http-status-codes";

const { isUUID } = schema.validators;
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const ALGORITHM = "aes-256-cbc";

//? Create Access Token for some parts and verify the token
export const access = {
  token(id: string) {
    if (!isUUID.parse(id))
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Invalid id type (uuid) to create Access Token"
      );

    const encryptData = `${id}`;
    const key = randomBytes(KEY_LENGTH);
    const iv = randomBytes(IV_LENGTH);

    const cipher = createCipheriv(ALGORITHM, key, iv);
    const token =
      cipher.update(encryptData, "utf8", "base64") + cipher.final("base64");

    const stringIv = iv.toString("hex");
    const stringKey = key.toString("hex");

    return {
      token,
      iv: stringIv.substring(3),
      key: stringKey.substring(3),
      code: stringKey.substring(0, 3) + stringIv.substring(0, 3),
    };
  },
  verify(token: string, key: string, iv: string, code: string) {
    const encrypted = Buffer.from(token, "base64");

    const codeKey = code.substring(0, 3);
    const codeIv = code.substring(3);

    const bufferKey = Buffer.from(codeKey + key, "hex");
    const bufferIv = Buffer.from(codeIv + iv, "hex");

    if (bufferIv.length !== IV_LENGTH || bufferKey.length !== KEY_LENGTH)
      return { valid: false, id: "" };

    const decipher = createDecipheriv(ALGORITHM, bufferKey, bufferIv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    const id = decrypted.toString();
    if (id === undefined) return { valid: false, id: "" };

    return isUUID.parse(id) ? { valid: true, id } : { valid: false, id: "" };
  },
} as const;
