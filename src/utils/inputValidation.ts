
import { sanitizeInput } from './securityUtils';

// Enhanced validation patterns
const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s\-\(\)]{10,15}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/,
  numeric: /^\d+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  url: /^https?:\/\/.+/
};

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData: Record<string, any>;
}

export class InputValidator {
  static validate(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Record<string, any> = {};

    for (const [field, rule] of Object.entries(schema)) {
      const value = data[field];
      
      // Check required fields
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors[field] = `${field} is required`;
        continue;
      }

      // Skip validation if field is not required and empty
      if (!rule.required && (value === undefined || value === null || value === '')) {
        sanitizedData[field] = value;
        continue;
      }

      const stringValue = String(value);

      // Sanitize input
      const sanitized = typeof value === 'string' ? sanitizeInput(stringValue) : value;
      
      // Length validation
      if (rule.minLength && stringValue.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`;
        continue;
      }

      if (rule.maxLength && stringValue.length > rule.maxLength) {
        errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
        continue;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(stringValue)) {
        errors[field] = `${field} format is invalid`;
        continue;
      }

      // Custom validation
      if (rule.custom) {
        const result = rule.custom(value);
        if (result !== true) {
          errors[field] = typeof result === 'string' ? result : `${field} is invalid`;
          continue;
        }
      }

      sanitizedData[field] = sanitized;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    };
  }

  static validateEmail(email: string): boolean {
    return VALIDATION_PATTERNS.email.test(email);
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validatePhone(phone: string): boolean {
    return VALIDATION_PATTERNS.phone.test(phone);
  }

  static validateUUID(uuid: string): boolean {
    return VALIDATION_PATTERNS.uuid.test(uuid);
  }

  static validateUrl(url: string): boolean {
    return VALIDATION_PATTERNS.url.test(url);
  }

  static sanitizeHtml(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
}

// Pre-defined validation schemas for common use cases
export const USER_VALIDATION_SCHEMA: ValidationSchema = {
  email: {
    required: true,
    maxLength: 255,
    pattern: VALIDATION_PATTERNS.email
  },
  full_name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s]+$/
  },
  phone: {
    required: false,
    pattern: VALIDATION_PATTERNS.phone
  }
};

export const NEWS_ARTICLE_VALIDATION_SCHEMA: ValidationSchema = {
  title: {
    required: true,
    minLength: 5,
    maxLength: 200
  },
  content: {
    required: true,
    minLength: 50,
    maxLength: 50000
  },
  excerpt: {
    required: false,
    maxLength: 500
  },
  slug: {
    required: true,
    pattern: VALIDATION_PATTERNS.slug,
    maxLength: 100
  }
};

export const MERCHANT_VALIDATION_SCHEMA: ValidationSchema = {
  business_name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  business_phone: {
    required: true,
    pattern: VALIDATION_PATTERNS.phone
  },
  email: {
    required: true,
    pattern: VALIDATION_PATTERNS.email
  }
};
