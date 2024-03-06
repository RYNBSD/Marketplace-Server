import googleTranslate from "@iamtraction/google-translate";
import type { ENUM } from "../constant/index.js";

type To = Exclude<(typeof ENUM.LOCALE)[number], "en">

export async function translate(text: string, to: To) {
  const t = await googleTranslate(text, { from: "en", to })
  return t.text
}
