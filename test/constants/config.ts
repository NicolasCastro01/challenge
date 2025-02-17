import * as dotenv from 'dotenv'
dotenv.config()

export const ENV = {
  TOKEN_VALID: String(process.env.TOKEN_VALID),
}
