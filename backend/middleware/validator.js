import { validationResult } from "express-validator";

// Middleware function to validate request
const validator = (req, res, next) => {
    const result = validationResult(req);

    if (result.isEmpty()) // If there are no validation errors, proceed to the next middleware
       return next();
    
    res.status(400).json({ errors: result.array() });
}

export default validator;
