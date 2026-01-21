/**
 * Error handling utilities for the application
 */

export interface AppError {
  code: string
  message: string
  details?: string
}

// Authentication errors
export const AuthErrors = {
  INVALID_CREDENTIALS: {
    code: "AUTH_001",
    message: "Invalid email or password",
    details: "Please check your email and password and try again.",
  },
  USER_NOT_FOUND: {
    code: "AUTH_002",
    message: "User not found",
    details: "The email address is not registered. Please sign up first.",
  },
  ACCOUNT_PENDING: {
    code: "AUTH_003",
    message: "Account pending approval",
    details: "Your account is waiting for admin approval. Please check back later.",
  },
  EMAIL_EXISTS: {
    code: "AUTH_004",
    message: "Email already registered",
    details: "This email is already registered. Please log in or use a different email.",
  },
  WEAK_PASSWORD: {
    code: "AUTH_005",
    message: "Password too weak",
    details: "Password must be at least 6 characters long.",
  },
  MISSING_FIELDS: {
    code: "AUTH_006",
    message: "Missing required fields",
    details: "Please fill in all required fields.",
  },
}

// Upload errors
export const UploadErrors = {
  UPLOAD_FAILED: {
    code: "UPLOAD_001",
    message: "Upload failed",
    details: "Failed to upload file. Please try again.",
  },
  FILE_TOO_LARGE: {
    code: "UPLOAD_002",
    message: "File too large",
    details: "File size must be less than 10MB.",
  },
  INVALID_FILE_TYPE: {
    code: "UPLOAD_003",
    message: "Invalid file type",
    details: "Please upload a valid image or video file.",
  },
  SIGNATURE_FAILED: {
    code: "UPLOAD_004",
    message: "Signature generation failed",
    details: "Failed to get upload signature. Please try again.",
  },
}

// Database errors
export const DatabaseErrors = {
  QUERY_FAILED: {
    code: "DB_001",
    message: "Database query failed",
    details: "Failed to fetch data. Please try again.",
  },
  INSERT_FAILED: {
    code: "DB_002",
    message: "Failed to create record",
    details: "Failed to save record to database. Please try again.",
  },
  UPDATE_FAILED: {
    code: "DB_003",
    message: "Failed to update record",
    details: "Failed to update record in database. Please try again.",
  },
  DELETE_FAILED: {
    code: "DB_004",
    message: "Failed to delete record",
    details: "Failed to delete record from database. Please try again.",
  },
}

// Donation errors
export const DonationErrors = {
  INVALID_AMOUNT: {
    code: "DONATION_001",
    message: "Invalid donation amount",
    details: "Donation amount must be greater than 0.",
  },
  INVALID_PAYMENT_METHOD: {
    code: "DONATION_002",
    message: "Invalid payment method",
    details: "Please select a valid payment method.",
  },
  DUPLICATE_TRANSACTION: {
    code: "DONATION_003",
    message: "Duplicate transaction",
    details: "This transaction ID has already been used. Please check your transaction ID.",
  },
  DONATION_FAILED: {
    code: "DONATION_004",
    message: "Failed to process donation",
    details: "Failed to process your donation. Please try again.",
  },
}

/**
 * Get error details from error response
 */
export function getErrorDetails(error: any): AppError {
  if (!error) {
    return {
      code: "UNKNOWN",
      message: "An unknown error occurred",
      details: "Please try again later.",
    }
  }

  // Handle Supabase errors
  if (error.message) {
    if (error.message.includes("duplicate")) {
      return DonationErrors.DUPLICATE_TRANSACTION
    }
    if (error.message.includes("invalid")) {
      return AuthErrors.INVALID_CREDENTIALS
    }
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      code: "ERROR",
      message: error,
    }
  }

  // Handle AppError type
  if (error.code && error.message) {
    return error as AppError
  }

  return {
    code: "UNKNOWN",
    message: "An error occurred",
    details: error.toString(),
  }
}

/**
 * Log error with context
 */
export function logError(context: string, error: any) {
  const errorDetails = getErrorDetails(error)
  console.error(`[${context}] ${errorDetails.code}: ${errorDetails.message}`, {
    details: errorDetails.details,
    originalError: error,
  })
}
