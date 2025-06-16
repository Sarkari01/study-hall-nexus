
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

    // Call EKQR API to check status
    const response = await fetch('https://api.ekqr.in/api/check_order_status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: ekqrApiKey,
        client_txn_id: clientTxnId,
        txn_date: txnDate
      })
    })

    const ekqrResponse = await response.json()
    console.log('EKQR status response:', ekqrResponse)

    if (!ekqrResponse.status) {
      throw new Error(ekqrResponse.msg || 'Failed to check payment status')
    }

    // Find the payment transaction
    const { data: paymentTransaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('gateway_response->client_txn_id', clientTxnId)
      .single()

    if (fetchError || !paymentTransaction) {
      console.error('Error fetching payment transaction:', fetchError)
      throw new Error('Payment transaction not found')
    }

    // Determine payment status from EKQR response
    const paymentStatus = ekqrResponse.data.status
    let newStatus = 'pending'
    let bookingStatus = 'pending'
    
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

    // If payment is completed and we have a temp booking ID, create the actual booking
    if (newStatus === 'completed') {
      const tempBookingId = paymentTransaction.gateway_response?.temp_booking_id
      
      if (tempBookingId && tempBookingId.startsWith('temp_')) {
        console.log('Creating booking for successful payment:', paymentTransaction.id)
        
        // The booking creation should be handled by the frontend after successful payment
        // We'll just return the success status so the frontend can proceed
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
          transactionId: paymentTransaction.gateway_transaction_id
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
