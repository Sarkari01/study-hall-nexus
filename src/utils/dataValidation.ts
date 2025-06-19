
export const validateMerchant = (data: any) => {
  const errors: string[] = [];
  
  if (!data) {
    return { isValid: false, errors: ['Data is required'] };
  }
  
  if (!data.business_name) {
    errors.push('Business name is required');
  }
  
  if (!data.full_name) {
    errors.push('Full name is required');
  }
  
  if (!data.business_phone) {
    errors.push('Business phone is required');
  }
  
  if (!data.contact_number) {
    errors.push('Contact number is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateStudent = (data: any) => {
  const errors: string[] = [];
  
  if (!data) {
    return { isValid: false, errors: ['Data is required'] };
  }
  
  if (!data.full_name) {
    errors.push('Full name is required');
  }
  
  if (!data.email) {
    errors.push('Email is required');
  }
  
  if (!data.phone) {
    errors.push('Phone is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
