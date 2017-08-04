const assert         = require('assert');
const TeamKeysDao    = require('./TeamKeysDao');
const InMemoryDb     = require('../../test/InMemoryDb');
const CreateTeamKeys = require('../../ops/db/TeamKeysDao.sql');
const Faker = require('../../test/Faker');

describe("TeamKeysDao", () => {

  it("insert and fetch key", () => {
    const teamId = Faker.uuid();
    const key = Faker.TeamKey({teamId});
    const updated = Faker.TeamKey({teamId});

    return Promise.resolve()
      .then(() => teamKeysDao.insertKey(key))
      .then(() => teamKeysDao.getTeamById(teamId))
      .then((team) => assert.deepEqual(team, key))
      .then(() => teamKeysDao.updateKey(teamId, updated))
      .then(() => teamKeysDao.getTeamById(teamId))
      .then((team) => assert.deepEqual(team, updated));
  });

  let teamKeysDao;
  const db = new InMemoryDb([CreateTeamKeys]);

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.setup())
      .then(() => teamKeysDao = new TeamKeysDao(db))

  });

  afterEach(() => {
    return Promise.resolve()
      .then(() => db.reset());
  })
});