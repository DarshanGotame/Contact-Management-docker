import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils";

// Helper function to extract validation errors
const extractValidationErrors = (errors: any[]) => {
  const extractedErrors: { [x: string]: any }[] = [];

  errors.forEach((err) => {
    switch (err.type) {
      case "field":
        extractedErrors.push({ [err.path]: err.msg });
        break;
      default:
        extractedErrors.push({
          [err.type]: err.msg,
        });
    }
  });

  return extractedErrors;
};

// Helper function to create validation error response
const createValidationError = (errors: any[], extractedErrors: { [x: string]: any }[]) => {
  return new ApiError({
    message: errors[0].msg,
    errors: extractedErrors,
    status: 400,
  });
};

const validate = (req: Request, res: Response, next: NextFunction): void => {
  console.log('=== VALIDATION MIDDLEWARE ===');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);
  console.log('Request params:', req.params);
  
  const errors = validationResult(req);
  console.log('Validation errors:', errors.array());

  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    const extractedErrors = extractValidationErrors(errorArray);
    const validationError = createValidationError(errorArray, extractedErrors);
    
    console.log('Validation failed with errors:', extractedErrors);
    throw validationError;
  }

  console.log('Validation passed, proceeding to controller');
  next();
};

export default validate;
