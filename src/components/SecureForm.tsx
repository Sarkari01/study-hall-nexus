
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { InputValidator, ValidationSchema } from '@/utils/inputValidation';
import { useCSRFProtection } from '@/utils/csrfProtection';
import { authRateLimiter } from '@/utils/rateLimiter';

interface SecureFormProps {
  children: React.ReactNode;
  onSubmit: (data: any, csrfToken: string) => Promise<void>;
  validationSchema?: ValidationSchema;
  requireCSRF?: boolean;
  requireRateLimit?: boolean;
  rateLimitKey?: string;
  submitButtonText?: string;
  className?: string;
}

const SecureForm: React.FC<SecureFormProps> = ({
  children,
  onSubmit,
  validationSchema,
  requireCSRF = true,
  requireRateLimit = true,
  rateLimitKey,
  submitButtonText = 'Submit',
  className = ''
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const { toast } = useToast();
  const { generateToken } = useCSRFProtection();
  const { handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (requireCSRF) {
      setCsrfToken(generateToken());
    }
  }, [requireCSRF, generateToken]);

  const handleSecureSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      // Rate limiting check
      if (requireRateLimit) {
        const identifier = rateLimitKey || 'form_submit';
        if (!authRateLimiter.isAllowed(identifier)) {
          const attemptsLeft = authRateLimiter.getAttemptsLeft(identifier);
          toast({
            title: "Rate Limit Exceeded",
            description: `Too many attempts. ${attemptsLeft} attempts remaining.`,
            variant: "destructive"
          });
          return;
        }
      }

      // Input validation
      if (validationSchema) {
        const validation = InputValidator.validate(data, validationSchema);
        if (!validation.isValid) {
          const errorMessages = Object.values(validation.errors).join(', ');
          toast({
            title: "Validation Error",
            description: errorMessages,
            variant: "destructive"
          });
          return;
        }
        data = validation.sanitizedData;
      }

      // Submit with CSRF token
      await onSubmit(data, csrfToken);

      // Generate new CSRF token for next submission
      if (requireCSRF) {
        setCsrfToken(generateToken());
      }

    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Error",
        description: "An error occurred while submitting the form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(handleSecureSubmit)} 
      className={`space-y-4 ${className}`}
      noValidate
    >
      {/* CSRF Token Hidden Field */}
      {requireCSRF && (
        <input type="hidden" name="csrf_token" value={csrfToken} />
      )}
      
      {children}
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Submitting...' : submitButtonText}
      </Button>
      
      {/* Display validation errors */}
      {Object.keys(errors).length > 0 && (
        <div className="text-red-600 text-sm">
          {Object.values(errors).map((error: any, index) => (
            <div key={index}>{error.message}</div>
          ))}
        </div>
      )}
    </form>
  );
};

export default SecureForm;
