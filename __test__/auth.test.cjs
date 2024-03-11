const request = require("supertest");
const { getCsrf } = require("./tools/fn.cjs");
const { newUser } = require("./tools/new.cjs");
const { host } = require("./config.cjs");

describe("Auth Router", () => {
  this.jwt = "";
  this.session = "";
  this.user = {};

  test("Post - Sign up", async () => {
    const { csrf, session } = await getCsrf(this.session);
    this.session = session;
    const { fake } = await newUser();

    const res = await request(host)
      .post("/api/auth/sign-up")
      .set("Content-Type", "multipart/form-data")
      .set("x-csrf-token", csrf)
      .set("Cookie", this.session)
      .attach("image", fake.image, "image")
      .field(fake);

    this.user = fake;
    expect(res.body.success).toEqual(true);
    expect(res.statusCode).toEqual(201);
    expect(res.ok).toEqual(true);
  });

  test("Post - Sign in", async () => {
    const { csrf, session } = await getCsrf(this.session);
    this.session = session;

    const res = await request(host)
      .post("/api/auth/sign-in")
      .set("Content-Type", "multipart/form-data")
      .set("x-csrf-token", csrf)
      .set("Cookie", this.session)
      .field(this.user);

    const [jwt, newSession] = res.headers["set-cookie"];
    this.jwt = jwt.split(";")[0].split("=")[1];
    this.session = newSession;

    expect(res.body.success).toEqual(true);
    expect(res.statusCode).toEqual(200);
    expect(res.ok).toEqual(true);
  });

  test("Post - Sign out", async () => {
    const res = await request(host)
      .post("/api/auth/sign-out")
      .set("Content-Type", "multipart/form-data")
      .set("Cookie", this.session);

    this.session = res.headers["set-cookie"];

    expect(res.ok).toEqual(true);
    expect(res.status).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  test("Post - me", async () => {
    const res = await request(host)
      .post("/api/auth/me")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", "Bearer" + this.jwt)
      .set("Cookie", this.session);

    this.session = res.headers["set-cookie"];

    console.log(res.body);
    expect(res.ok).toEqual(true);
    expect(res.status).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  test("Pot - Sign in - try authenticate after authentication", async () => {
    const { csrf, session } = await getCsrf(this.session);
    this.session = session;

    const res = await request(host)
      .post("/api/auth/sign-in")
      .set("Content-Type", "multipart/form-data")
      .set("x-csrf-token", csrf)
      .set("Cookie", this.session)
      .field({ email: "wrong@test.com", password: "wrong-password-1223" });

    expect(res.body.success).toEqual(false);
    expect(res.ok).toEqual(false);
  });

  test("Put - verify email", async () => {});

  test("Put - forget password", async () => {});

  test("Post - Sign in - test the new password", async () => {});
});
