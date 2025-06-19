
// Enhanced input validation and sanitization utilities

export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data URLs
    .replace(/vbscript:/gi, '') // Remove vbscript
    .trim()
    .slice(0, 1000); // Limit length
};

export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = sanitizeInput(email);
  return emailRegex.test(sanitized) ? sanitized : '';
};

export const sanitizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  // Allow only digits, spaces, hyphens, parentheses, and plus
  return phone.replace(/[^\d\s\-\(\)\+]/g, '').slice(0, 20);
};

export const sanitizeNumericInput = (input: string | number): number => {
  if (typeof input === 'number') return Math.max(0, input);
  const num = parseFloat(String(input).replace(/[^\d.-]/g, ''));
  return isNaN(num) ? 0 : Math.max(0, num);
};

export const validateStudyHallId = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  // UUID format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const validateBookingData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.booking_date || new Date(data.booking_date) <= new Date()) {
    errors.push('Booking date must be in the future');
  }
  
  if (!data.start_time || !data.end_time) {
    errors.push('Start and end times are required');
  }
  
  if (data.start_time && data.end_time && data.start_time >= data.end_time) {
    errors.push('End time must be after start time');
  }
  
  if (!validateStudyHallId(data.study_hall_id)) {
    errors.push('Invalid study hall ID');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Add the missing InputValidator class and related exports
export class InputValidator {
  static sanitizeHtml(input: string): string {
    return sanitizeInput(input);
  }

  static validateEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUUID(id: string): boolean {
    return validateStudyHallId(id);
  }

  static validate(data: any, schema: ValidationSchema): { isValid: boolean; errors: Record<string, string>; sanitizedData: any } {
    const errors: Record<string, string> = {};
    const sanitizedData: any = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      
      if (rules.required && (!value || value.toString().trim() === '')) {
        errors[field] = `${field} is required`;
        continue;
      }

      if (value) {
        let sanitizedValue = value;
        
        if (rules.type === 'email') {
          sanitizedValue = sanitizeEmail(value);
          if (!this.validateEmail(sanitizedValue)) {
            errors[field] = `Invalid ${field} format`;
          }
        } else if (rules.type === 'string') {
          sanitizedValue = sanitizeInput(value);
          if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
            errors[field] = `${field} must be less than ${rules.maxLength} characters`;
          }
        }
        
        sanitizedData[field] = sanitizedValue;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    };
  }
}

export interface ValidationSchema {
  [field: string]: {
    required?: boolean;
    type: 'string' | 'email' | 'number';
    maxLength?: number;
  };
}

export const USER_VALIDATION_SCHEMA: ValidationSchema = {
  full_name: { required: true, type: 'string', maxLength: 100 },
  email: { required: true, type: 'email' },
  phone: { required: false, type: 'string', maxLength: 20 }
};

export const rateLimiter = (() => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  
  return {
    isAllowed: (identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
      const now = Date.now();
      const userAttempts = attempts.get(identifier);
      
      if (!userAttempts || now > userAttempts.resetTime) {
        attempts.set(identifier, { count: 1, resetTime: now + windowMs });
        return true;
      }
      
      if (userAttempts.count >= maxAttempts) {
        return false;
      }
      
      userAttempts.count++;
      return true;
    },
    
    reset: (identifier: string): void => {
      attempts.delete(identifier);
    }
  };
})();
