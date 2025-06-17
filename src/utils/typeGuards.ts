
import { ValidRole } from './roleValidation';

// Type guards for runtime type checking
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

// Specific type guards for application types
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Database entity type guards
export const isUserProfile = (obj: unknown): obj is { 
  user_id: string; 
  full_name?: string; 
  role?: ValidRole;
} => {
  return isObject(obj) && 
         isString(obj.user_id) && 
         isValidUUID(obj.user_id) &&
         (obj.full_name === undefined || isString(obj.full_name)) &&
         (obj.role === undefined || isString(obj.role));
};

export const isBooking = (obj: unknown): obj is {
  id: string;
  student_id: string;
  study_hall_id: string;
  booking_date: string;
  status: string;
} => {
  return isObject(obj) &&
         isString(obj.id) && isValidUUID(obj.id) &&
         isString(obj.student_id) && isValidUUID(obj.student_id) &&
         isString(obj.study_hall_id) && isValidUUID(obj.study_hall_id) &&
         isString(obj.booking_date) &&
         isString(obj.status);
};

export const isStudyHall = (obj: unknown): obj is {
  id: string;
  name: string;
  merchant_id: string;
  capacity: number;
  status: string;
} => {
  return isObject(obj) &&
         isString(obj.id) && isValidUUID(obj.id) &&
         isString(obj.name) &&
         isString(obj.merchant_id) && isValidUUID(obj.merchant_id) &&
         isNumber(obj.capacity) &&
         isString(obj.status);
};

// Validation helpers
export const validateRequired = <T>(value: T, fieldName: string): T => {
  if (value === null || value === undefined || value === '') {
    throw new Error(`${fieldName} is required`);
  }
  return value;
};

export const validateEmail = (email: string): string => {
  validateRequired(email, 'Email');
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
  return email;
};

export const validatePhone = (phone: string): string => {
  validateRequired(phone, 'Phone');
  if (!isValidPhone(phone)) {
    throw new Error('Invalid phone format');
  }
  return phone;
};

export const validateUUID = (uuid: string, fieldName: string = 'ID'): string => {
  validateRequired(uuid, fieldName);
  if (!isValidUUID(uuid)) {
    throw new Error(`Invalid ${fieldName} format`);
  }
  return uuid;
};
