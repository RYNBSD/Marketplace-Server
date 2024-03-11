const { TestError } = require("../error.cjs");
const { host } = require("../config.cjs")

function random(v1, v2) {
  return Math.round(Math.random()) ? v1 : v2;
}

async function getCsrf(session) {
  const res = await fetch(`${host}/security/csrf`, {
    headers: {
      cookie: session,
    },
  });

  const csrf = res.headers.get("x-csrf-token");
  if (!csrf) {
    const json = await res.json();
    throw new TestError(json?.message ?? "No csrf in getCsrf", res.status);
  }

  const newSession = await getSession(res.headers);
  if (!newSession) {
    const json = await res.json();
    throw new TestError(json?.message ?? "No session in getCsrf", res.status);
  }

  return { csrf, session: newSession };
}

/**
 *
 * @param {Headers} headers
 */
async function getSession(headers) {
  const setCookie = headers.getSetCookie();
  return setCookie.at(setCookie.length - 1) ?? "";
}

module.exports = {
  random,
  getCsrf,
  getSession,
};
