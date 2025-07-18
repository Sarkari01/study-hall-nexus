
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentData {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  userId: string;
  planName?: string;
  subscriptionId?: string;
}

interface BookingData {
  bookingId: string;
  studyHallName: string;
}

interface EkqrOrderResponse {
  orderId: string;
  paymentUrl: string;
  upiIntent: {
    bhim_link?: string;
    phonepe_link?: string;
    paytm_link?: string;
    gpay_link?: string;
  };
  clientTxnId: string;
}

export const useEkqrPayment = () => {
  const [processing, setProcessing] = useState(false);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const createOrder = async (
    paymentData: PaymentData,
    bookingData?: BookingData,
    isSubscription: boolean = false
  ): Promise<EkqrOrderResponse | null> => {
    try {
      setProcessing(true);

      const { data, error } = await supabase.functions.invoke('create-ekqr-order', {
        body: {
          paymentData,
          bookingData,
          isSubscription
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating EKQR order:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create payment order. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const checkPaymentStatus = async (clientTxnId: string, txnDate: string) => {
    try {
      console.log('Checking payment status with:', { clientTxnId, txnDate });
      
      const { data, error } = await supabase.functions.invoke('check-ekqr-status', {
        body: {
          clientTxnId,
          txnDate
        }
      });

      if (error) {
        console.error('Error from check-ekqr-status function:', error);
        throw new Error(error.message);
      }

      console.log('Payment status check response:', data);
      return data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return null;
    }
  };

  const startStatusPolling = (
    clientTxnId: string,
    txnDate: string,
    onStatusUpdate: (status: string, transactionId?: string) => void,
    maxPolls: number = 60 // Poll for 5 minutes (60 * 5 seconds)
  ) => {
    let pollCount = 0;

    const poll = async () => {
      console.log(`Polling attempt ${pollCount + 1}/${maxPolls} for transaction:`, clientTxnId);
      
      if (pollCount >= maxPolls) {
        console.log('Maximum polling attempts reached, timing out');
        if (pollInterval) {
          clearInterval(pollInterval);
          setPollInterval(null);
        }
        onStatusUpdate('timeout');
        return;
      }

      const result = await checkPaymentStatus(clientTxnId, txnDate);
      
      if (result && result.success) {
        const status = result.data.paymentStatus;
        const transactionId = result.data.transactionId;
        
        console.log('Payment status received:', status, 'Transaction ID:', transactionId);
        
        if (status === 'completed' || status === 'failed') {
          if (pollInterval) {
            clearInterval(pollInterval);
            setPollInterval(null);
          }
          onStatusUpdate(status, transactionId);
          return;
        }
      } else {
        console.log('No valid status received, continuing to poll...');
      }

      pollCount++;
    };

    // Start polling immediately and then every 5 seconds
    poll();
    const interval = setInterval(poll, 5000);
    setPollInterval(interval);
  };

  const stopStatusPolling = () => {
    if (pollInterval) {
      console.log('Stopping payment status polling');
      clearInterval(pollInterval);
      setPollInterval(null);
    }
  };

  const openUpiApp = (upiLink: string) => {
    try {
      // Create a temporary link element to trigger the UPI app
      const link = document.createElement('a');
      link.href = upiLink;
      link.click();
    } catch (error) {
      console.error('Error opening UPI app:', error);
      toast({
        title: "UPI App Error",
        description: "Unable to open UPI app. Please use the web payment option.",
        variant: "destructive"
      });
    }
  };

  return {
    processing,
    createOrder,
    checkPaymentStatus,
    startStatusPolling,
    stopStatusPolling,
    openUpiApp
  };
};
