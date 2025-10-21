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
    code: 'INTERNAL_ERROR',
    message: 'Internal server error.',
  },
  SupabaseStorageError: {
    status: 500,
    code: 'INTERNAL_ERROR',
    message: 'Internal server error.',
  },
  UnexpectedError: {
    status: 500,
    code: 'INTERNAL_ERROR',
    message: 'Internal server error'
  }
} as const;


