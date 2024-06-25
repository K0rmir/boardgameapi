import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 100 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests.
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers

})

