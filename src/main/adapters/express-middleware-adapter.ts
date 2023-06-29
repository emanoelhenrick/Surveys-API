import { type NextFunction, type Request, type Response } from 'express'
import { type Middleware, type HttpRequest } from '../../presentation/protocols'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = { headers: req.headers }
    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode >= 400 && httpResponse.statusCode <= 599) {
      return res
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.body.message })
    } else if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    }
  }
}
