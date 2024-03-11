const FormData = require("form-data");
const { user } = require("./faker.cjs");
const { random } = require("./fn.cjs");

async function newUser() {
  const { username, email, password, image } = user;
  const theme = random("light", "dark");
  const locale = random("ar", "en");
  const fake = {
    username: username(),
    email: email(),
    password: password({ length: 8 }),
    image: await image(),
    locale,
    theme,
  };

  const formData = new FormData();
  formData.append("username", fake.username);
  formData.append("email", fake.email);
  formData.append("password", fake.password);
  formData.append("image", fake.image);
  formData.append("locale", fake.locale);
  formData.append("theme", fake.password);

  return { formData, fake };
}

module.exports = {
  newUser,
};
