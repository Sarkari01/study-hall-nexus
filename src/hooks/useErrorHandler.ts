
import { useToast } from "@/hooks/use-toast";
import { useCallback } from 'react';

interface ErrorDetails {
  message: string;
  code?: string;
  statusCode?: number;
  context?: string;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: unknown, context?: string) => {
    console.error(`Error in ${context || 'application'}:`, error);

    let errorDetails: ErrorDetails = {
      message: 'An unexpected error occurred',
      context
    };

    // Handle different error types
    if (error instanceof Error) {
      errorDetails.message = error.message;
    } else if (typeof error === 'string') {
      errorDetails.message = error;
    } else if (error && typeof error === 'object') {
      const errorObj = error as any;
      errorDetails.message = errorObj.message || errorObj.error_description || 'Unknown error';
      errorDetails.code = errorObj.code;
      errorDetails.statusCode = errorObj.statusCode || errorObj.status;
    }

    // Show user-friendly error message
    toast({
      title: "Error",
      description: errorDetails.message,
      variant: "destructive"
    });

    return errorDetails;
  }, [toast]);

  const handleAuthError = useCallback((error: unknown) => {
    const details = handleError(error, 'Authentication');
    
    // Handle specific auth errors
    if (details.message.includes('Invalid login credentials')) {
      toast({
        title: "Login Failed",
        description: "Please check your email and password",
        variant: "destructive"
      });
    } else if (details.message.includes('Email not confirmed')) {
      toast({
        title: "Email Verification Required",
        description: "Please check your email and click the verification link",
        variant: "destructive"
      });
    }

    return details;
  }, [handleError, toast]);

  const handleApiError = useCallback((error: unknown, operation?: string) => {
    const details = handleError(error, `API ${operation || 'operation'}`);
    
    // Handle specific API errors
    if (details.statusCode === 401) {
      toast({
        title: "Unauthorized",
        description: "Please log in again",
        variant: "destructive"
      });
    } else if (details.statusCode === 403) {
      toast({
        title: "Access Denied",
        description: "You don't have permission for this action",
        variant: "destructive"
      });
    } else if (details.statusCode === 404) {
      toast({
        title: "Not Found",
        description: "The requested resource was not found",
        variant: "destructive"
      });
    }

    return details;
  }, [handleError, toast]);

  return {
    handleError,
    handleAuthError,
    handleApiError
  };
};
