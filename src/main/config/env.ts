import ('dotenv/config')

export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://docker:docker@mongo:27017/?authMechanism=DEFAULT',
  port: process.env.PORT ?? 10000,
  jwt_secret: process.env.JWT_SECRET ?? 'jl39cjjhkdf3h2'
}
