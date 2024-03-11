const { faker } = require("@faker-js/faker");

async function urlImageToBuffer(url) {
  const res = await fetch(url);
  return Buffer.from(await res.arrayBuffer());
}

module.exports = {
  user: {
    username: faker.internet.userName,
    email: faker.internet.email,
    password: faker.internet.password,
    image: () => urlImageToBuffer(faker.image.urlPicsumPhotos()),
  },
  seller: {},
  category: {},
  product: {},
  tag: {},
};
