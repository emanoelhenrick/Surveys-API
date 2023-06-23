import * as dotenv from 'dotenv'

dotenv.config({
  path: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env'
})

export default {
  mongoUrl: process.env.MONGO_URL,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET ?? 'jl39cjjhkdf3h2'
}
