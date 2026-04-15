export const validateRequest = (validator) => (req, res, next) => {
  const result = validator(req.body);

  if (!result.isValid) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: result.errors,
    });
  }

  req.validatedBody = result.value;
  return next();
};

export default validateRequest;
