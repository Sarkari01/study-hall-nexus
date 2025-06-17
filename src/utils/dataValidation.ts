
import { isValidEmail, isValidPhone, isValidUUID } from './typeGuards';

export interface ValidationRule<T = any> {
  field: keyof T;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'uuid' | 'date' | 'array';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean | string;
  sanitize?: (value: any) => any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  sanitizedData?: any;
}

export class DataValidator<T extends Record<string, any>> {
  private rules: ValidationRule<T>[];

  constructor(rules: ValidationRule<T>[]) {
    this.rules = rules;
  }

  validate(data: Partial<T>): ValidationResult {
    const errors: Record<string, string[]> = {};
    const sanitizedData: Record<string, any> = { ...data };

    for (const rule of this.rules) {
      const field = rule.field as string;
      const value = (data as any)[field];
      const fieldErrors: string[] = [];

      // Check required fields
      if (rule.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(`${field} is required`);
        continue;
      }

      // Skip validation for optional empty fields
      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Type validation
      if (rule.type) {
        const typeError = this.validateType(value, rule.type, field);
        if (typeError) {
          fieldErrors.push(typeError);
        }
      }

      // Length validation for strings
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          fieldErrors.push(`${field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          fieldErrors.push(`${field} must not exceed ${rule.maxLength} characters`);
        }
      }

      // Numeric range validation
      if (typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          fieldErrors.push(`${field} must be at least ${rule.min}`);
        }
        if (rule.max !== undefined && value > rule.max) {
          fieldErrors.push(`${field} must not exceed ${rule.max}`);
        }
      }

      // Pattern validation
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        fieldErrors.push(`${field} format is invalid`);
      }

      // Custom validation
      if (rule.customValidator) {
        const customResult = rule.customValidator(value);
        if (customResult !== true) {
          fieldErrors.push(typeof customResult === 'string' ? customResult : `${field} is invalid`);
        }
      }

      // Sanitization
      if (rule.sanitize && fieldErrors.length === 0) {
        sanitizedData[field] = rule.sanitize(value);
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData: Object.keys(errors).length === 0 ? sanitizedData : undefined
    };
  }

  private validateType(value: any, type: string, field: string): string | null {
    switch (type) {
      case 'string':
        if (typeof value !== 'string') return `${field} must be a string`;
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) return `${field} must be a valid number`;
        break;
      case 'boolean':
        if (typeof value !== 'boolean') return `${field} must be a boolean`;
        break;
      case 'email':
        if (typeof value !== 'string' || !isValidEmail(value)) return `${field} must be a valid email`;
        break;
      case 'phone':
        if (typeof value !== 'string' || !isValidPhone(value)) return `${field} must be a valid phone number`;
        break;
      case 'uuid':
        if (typeof value !== 'string' || !isValidUUID(value)) return `${field} must be a valid UUID`;
        break;
      case 'date':
        if (!(value instanceof Date) && isNaN(Date.parse(value))) return `${field} must be a valid date`;
        break;
      case 'array':
        if (!Array.isArray(value)) return `${field} must be an array`;
        break;
    }
    return null;
  }
}

// Common validation rules for different entities
export const studentValidationRules: ValidationRule[] = [
  { field: 'full_name', required: true, type: 'string', minLength: 2, maxLength: 100 },
  { field: 'email', required: true, type: 'email' },
  { field: 'phone', required: true, type: 'phone' },
  { field: 'status', type: 'string', customValidator: (value) => ['active', 'inactive', 'suspended'].includes(value) }
];

export const merchantValidationRules: ValidationRule[] = [
  { field: 'business_name', required: true, type: 'string', minLength: 2, maxLength: 200 },
  { field: 'full_name', required: true, type: 'string', minLength: 2, maxLength: 100 },
  { field: 'business_phone', required: true, type: 'phone' },
  { field: 'contact_number', required: true, type: 'phone' },
  { field: 'email', type: 'email' },
  { field: 'approval_status', type: 'string', customValidator: (value) => ['pending', 'approved', 'rejected'].includes(value) }
];

export const studyHallValidationRules: ValidationRule[] = [
  { field: 'name', required: true, type: 'string', minLength: 2, maxLength: 200 },
  { field: 'location', required: true, type: 'string', minLength: 5, maxLength: 500 },
  { field: 'capacity', required: true, type: 'number', min: 1, max: 1000 },
  { field: 'price_per_day', required: true, type: 'number', min: 0 },
  { field: 'merchant_id', type: 'uuid' },
  { field: 'status', type: 'string', customValidator: (value) => ['draft', 'active', 'inactive', 'maintenance'].includes(value) }
];

export const bookingValidationRules: ValidationRule[] = [
  { field: 'student_id', required: true, type: 'uuid' },
  { field: 'study_hall_id', required: true, type: 'uuid' },
  { field: 'booking_date', required: true, type: 'date' },
  { field: 'start_time', required: true, type: 'string' },
  { field: 'end_time', required: true, type: 'string' },
  { field: 'total_amount', required: true, type: 'number', min: 0 },
  { field: 'final_amount', required: true, type: 'number', min: 0 },
  { field: 'status', type: 'string', customValidator: (value) => ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show'].includes(value) }
];

// Utility functions for common validations
export const validateStudent = (data: any): ValidationResult => {
  const validator = new DataValidator(studentValidationRules);
  return validator.validate(data);
};

export const validateMerchant = (data: any): ValidationResult => {
  const validator = new DataValidator(merchantValidationRules);
  return validator.validate(data);
};

export const validateStudyHall = (data: any): ValidationResult => {
  const validator = new DataValidator(studyHallValidationRules);
  return validator.validate(data);
};

export const validateBooking = (data: any): ValidationResult => {
  const validator = new DataValidator(bookingValidationRules);
  return validator.validate(data);
};

// Sanitization helpers
export const sanitizeString = (value: string): string => {
  return value.trim().replace(/[<>]/g, '');
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d+\-\(\)\s]/g, '').trim();
};
