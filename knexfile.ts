
const defaults = {
  client: 'mysql',
  pool: {
    min: 2,
    max: 10
  },
  seeds: {
    extension: 'ts',
    directory: './test/seeds'
  }
}

export default {
  travis: {
    ...defaults,
    connection: {
      host: '127.0.0.1',
      port: '3306',
      database: "slims_test",
      user: 'travis',
      password: "",
      multipleStatements: true
    },
  },
  test: {
    ...defaults,
    connection: {
      host: '127.0.0.1',
      port: '3306',
      database: "slims_api_test",
      user: 'slims_test_user',
      password: "testpassword",
      multipleStatements: true
    },

  }
};
