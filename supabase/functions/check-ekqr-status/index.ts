
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { clientTxnId, txnDate } = await req.json()
    const ekqrApiKey = Deno.env.get('EKQR_API_KEY')

    if (!ekqrApiKey) {
      throw new Error('EKQR API key not configured')
    }

    console.log('Checking EKQR payment status:', { clientTxnId, txnDate })

    // Ensure date format is DD-MM-YYYY for EKQR API (with hyphens, not slashes)
    let formattedDate = txnDate;
    if (txnDate && txnDate.includes('-')) {
      // If it's already DD-MM-YYYY format, use as is
      formattedDate = txnDate;
    } else if (txnDate && txnDate.includes('/')) {
      // Convert DD/MM/YYYY to DD-MM-YYYY
      formattedDate = txnDate.replace(/\//g, '-');
    } else {
      // If date is in different format, try to parse and reformat
      const date = new Date(txnDate);
      if (!isNaN(date.getTime())) {
        formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      }
    }

    console.log('Using formatted date for EKQR API:', formattedDate);

    // Call EKQR API to check status
    const response = await fetch('https://api.ekqr.in/api/check_order_status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: ekqrApiKey,
        client_txn_id: clientTxnId,
        txn_date: formattedDate
      })
    })

    const ekqrResponse = await response.json()
    console.log('EKQR status response:', ekqrResponse)

    if (!ekqrResponse.status) {
      // If EKQR API returns false status, check if it's a date format issue
      if (ekqrResponse.msg?.includes('invalid')) {
        console.error('EKQR API date format issue:', ekqrResponse.msg);
      }
      throw new Error(ekqrResponse.msg || 'Failed to check payment status')
    }

    // Find the payment transaction using a different approach - search by gateway_transaction_id first
    let paymentTransaction = null;
    
    // Try to find by gateway_transaction_id (which should be the clientTxnId)
    const { data: transactionsByTxnId, error: txnIdError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('gateway_transaction_id', clientTxnId)
      .maybeSingle()

    if (transactionsByTxnId && !txnIdError) {
      paymentTransaction = transactionsByTxnId;
      console.log('Found payment transaction by gateway_transaction_id');
    } else {
      // If not found by gateway_transaction_id, try to search by looking for the clientTxnId in the gateway_response JSON
      const { data: allTransactions, error: allTxnError } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100) // Limit to recent transactions

      if (!allTxnError && allTransactions) {
        // Search through recent transactions to find the one with matching clientTxnId in gateway_response
        paymentTransaction = allTransactions.find(txn => {
          if (txn.gateway_response && typeof txn.gateway_response === 'object') {
            return txn.gateway_response.client_txn_id === clientTxnId || 
                   txn.gateway_response.clientTxnId === clientTxnId;
          }
          return false;
        });
        
        if (paymentTransaction) {
          console.log('Found payment transaction by searching gateway_response');
        }
      }
    }

    if (!paymentTransaction) {
      console.error('Payment transaction not found for clientTxnId:', clientTxnId);
      throw new Error('Payment transaction not found')
    }

    // Determine payment status from EKQR response
    const paymentStatus = ekqrResponse.data?.status
    let newStatus = 'pending'
    let bookingStatus = 'pending'
    
    console.log('EKQR payment status from API:', paymentStatus);
    
    switch (paymentStatus?.toLowerCase()) {
      case 'success':
      case 'completed':
        newStatus = 'completed'
        bookingStatus = 'confirmed'
        break
      case 'failed':
      case 'cancelled':
        newStatus = 'failed'
        bookingStatus = 'cancelled'
        break
      default:
        newStatus = 'pending'
        bookingStatus = 'pending'
    }

    console.log('Updating payment status to:', newStatus);

    // Update payment transaction status
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        payment_status: newStatus,
        gateway_response: {
          ...paymentTransaction.gateway_response,
          status_check_data: {
            ...ekqrResponse.data,
            checked_at: new Date().toISOString()
          }
        }
      })
      .eq('id', paymentTransaction.id)

    if (updateError) {
      console.error('Error updating payment transaction:', updateError)
      throw new Error('Failed to update payment status')
    }

    // If payment is completed and we have a temp booking ID, mark for booking creation
    if (newStatus === 'completed') {
      const tempBookingId = paymentTransaction.gateway_response?.temp_booking_id || paymentTransaction.gateway_response?.udf2
      
      if (tempBookingId && tempBookingId.startsWith('temp_')) {
        console.log('Payment completed for temp booking:', tempBookingId)
        // The actual booking creation will be handled by the frontend
      } else if (paymentTransaction.booking_id) {
        // Update existing booking status
        await supabase
          .from('bookings')
          .update({
            status: bookingStatus,
            payment_status: newStatus
          })
          .eq('id', paymentTransaction.booking_id)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          paymentStatus: newStatus,
          bookingStatus: bookingStatus,
          transactionId: paymentTransaction.gateway_transaction_id || ekqrResponse.data?.txn_id
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error checking EKQR status:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
