import { ValidationErrorItem } from '../interfaces/validation-error.interface';

export class ErrorsResponse {
  message: string;
  code: number | null = null;
  errors?: ValidationErrorItem[] = [];
}
