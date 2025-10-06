//readonly object response for rest
export type ErrorType = keyof typeof ERROR_RESPONSES;
export const ERROR_RESPONSES = {
  RateLimitError: {
    status: 429,
    code: 'RATE_LIMIT',
    message: 'Too many requests',
  },
  InvalidCredentialsError: {
    status: 400,
    code: 'INVALID_CREDENTIALS',
    message: 'Incorrect email or password',
  },
  AlreadyExist: {
    status: 409,
    code: 'ALREADY_EXISTS',
    message: 'User already exists',
  },
  DatabaseError: {
    status: 500,
    code: 'DATABASE_ERROR',
    message: 'Database operation failed',
  },
} as const;


