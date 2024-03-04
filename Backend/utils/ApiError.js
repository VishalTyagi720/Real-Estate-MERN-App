class ApiError extends Error{
    constructor(statusCode, message = "Something went wrong", errors = [], stack = '') {
        super(message);
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

// const errorHandler = (statusCode, message) => {
//     const error = new Error();
//     error.statusCode = statusCode
//     error.message = message
//     return error
// }


export default ApiError;