/**
 * @description This middleware handles requests to routes that do not exist.
 * It creates a 404 error and passes it to the next error-handling middleware.
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); 
};

/**
 * @description This is our main error-handling middleware.
 * It catches all errors passed to it and sends a structured JSON response.
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };