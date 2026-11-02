import boom from '@hapi/boom';


/**
 * Middleware factory function that validates request data against a Joi schema.
 * @param {object} schema - A Joi schema object used to validate the data
 * @param {string} property - The property name on the request object to validate (e.g., 'body', 'params', 'query')
 * @returns {function} Express middleware function that validates data and passes errors to the next middleware
 */
 function validatorHandler(schema, property) {
    return (req, res, next) => {
        const data = req[property];
        const { error } = schema.validate(data);
        if (error) {
            next(boom.badRequest(error.details[0].message));
        }
        next();
    };
}

export { validatorHandler };