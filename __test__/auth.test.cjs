const request = require("supertest");
const { getCsrf } = require("./tools/fn.cjs");
const { newUser } = require("./tools/new.cjs");

describe("Auth Router", () => {
  this.jwt = "";
  this.session = "";

  test("Post - Sign up", async () => {
    const { csrf, session } = await getCsrf(this.session);
    const { formData, fake } = await newUser();

    const res = await request("")
      .post()
      .set("Content-Type", "multipart/form-data")
      .send("x-csrf-token", csrf)
      .set("Cookie", session)
      .attach("image", fake.image, "image")
      .field(formData);

    expect(res.body.success).toEqual(true);
    expect(res.statusCode).toEqual(201);
  });

  test("Post - Sign in", async () => {});

  test("Post - Sign out", async () => {});

  test("Post - Sign in - wrong info", async () => {});

  test("Post - me", async () => {});

  test("Pot - Sign in - try authenticate after authentication", async () => {});

  test("Put - verify email", async () => {});

  test("Put - forget password", async () => {});

  test("Post - Sign in - test new password", async () => {});
});
