class ValidationError extends Error {
    constructor(message) {
      super(message)
      this.name = 'VALIDATION_ERROR'
      this.message = message
    }
  }
  
  class PermissionError extends Error {
    constructor(message) {
      super(message)
      this.name = 'PERMISSION_ERROR'
      this.message = message
    }
  }
  
  class DatabaseError extends Error {
    constructor(message) {
      super(message)
      this.name = 'DATABASE_ERROR'
      this.message = message
    }
  }

  class NotFoundError extends Error {
    constructor(message) {
      super(message)
      this.name = 'NOT_FOUND_ERROR'
      this.message = message
    }
  }

  class NotificationError extends Error {
    constructor(message) {
      super(message)
      this.name = 'MESSAGE_SENDING_ERROR'
      this.message = message
    }
  }
  
  module.exports = {
    ValidationError,
    NotificationError,
    PermissionError,
    DatabaseError,
    NotFoundError
  }