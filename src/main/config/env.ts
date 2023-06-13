export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://docker:docker@localhost:27017/?authMechanism=DEFAULT',
  port: process.env.PORT ?? 10000
}
