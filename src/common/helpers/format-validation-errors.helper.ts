import { ValidationError } from 'class-validator';

import { ValidationErrorItem } from '../interfaces/validation-error.interface';

export const getClassValidatorErrors = (
  validationErrors: ValidationError[],
  parentProperty = '',
): ValidationErrorItem[] => {
  const errors: ValidationErrorItem[] = [];

  getValidationErrorsRecursively(validationErrors, errors, parentProperty);

  return errors;
};

const getValidationErrorsRecursively = (
  validationErrors: ValidationError[],
  errors: ValidationErrorItem[],
  parentProperty = '',
): void => {
  for (const error of validationErrors) {
    const propertyPath = parentProperty
      ? `${parentProperty}.${error.property}`
      : error.property;

    if (error.constraints) {
      errors.push({
        property: propertyPath,
        errors: Object.values(error.constraints),
      });
    }

    if (error.children?.length) {
      getValidationErrorsRecursively(error.children, errors, propertyPath);
    }
  }
};
