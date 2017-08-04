const {overrideDefaults} = require('../server/utils/overrideDefaults');

const faker = require("faker");
const uuid  = require("uuid");

class Faker {

  static uuid() {
    return uuid.v4();
  }

  static TeamKey(overrides = {}) {
    const data = overrideDefaults({
      teamId: Faker.uuid(),
      accessKeyId: Faker.uuid(),
      secretAccessKey: Faker.uuid()
    }, overrides);

    return data;
  }
}

module.exports = Faker;