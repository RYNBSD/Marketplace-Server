const { TestError } = require("../error.cjs");

function random(v1, v2) {
  return Math.round(Math.random()) ? v1 : v2;
}

async function getCsrf(session) {
  const res = await fetch("", {
    headers: {
      cookie: session,
    },
  });

  const csrf = res.headers.get("x-csrf-token");
  if (!csrf) {
    const json = await res.json();
    throw new TestError(json?.message ?? "No csrf in getCsrf", res.status);
  }

  const session = getSession(headers);
  if (!session) {
    const json = await res.json();
    throw new TestError(json?.message ?? "No session in getCsrf", res.status);
  }

  return { csrf, session };
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
