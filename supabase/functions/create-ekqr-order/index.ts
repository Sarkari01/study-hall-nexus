
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

    const { bookingData, paymentData, isSubscription = false } = await req.json()
    const ekqrApiKey = Deno.env.get('EKQR_API_KEY')

    if (!ekqrApiKey) {
      throw new Error('EKQR API key not configured')
    }

    // Generate unique client transaction ID
    const clientTxnId = `${isSubscription ? 'SUB' : 'BKG'}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Prepare EKQR order data
    const orderData = {
      key: ekqrApiKey,
      client_txn_id: clientTxnId,
      amount: paymentData.amount.toString(),
      p_info: isSubscription ? `Subscription - ${paymentData.planName}` : `Study Hall Booking - ${bookingData.studyHallName}`,
      customer_name: paymentData.customerName,
      customer_email: paymentData.customerEmail,
      customer_mobile: paymentData.customerMobile,
      redirect_url: `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/functions/v1/ekqr-payment-callback`,
      udf1: isSubscription ? 'subscription' : 'booking',
      udf2: isSubscription ? paymentData.subscriptionId : bookingData.bookingId,
      udf3: paymentData.userId
    }

    console.log('Creating EKQR order:', { clientTxnId, amount: orderData.amount })

    // Call EKQR API to create order
    const response = await fetch('https://api.ekqr.in/api/create_order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })

    const ekqrResponse = await response.json()
    console.log('EKQR response:', ekqrResponse)

    if (!ekqrResponse.status) {
      throw new Error(ekqrResponse.msg || 'Failed to create payment order')
    }

    // Store payment transaction in database
    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        booking_id: isSubscription ? null : bookingData.bookingId,
        amount: parseFloat(paymentData.amount),
        payment_method: 'ekqr',
        payment_status: 'pending',
        gateway_transaction_id: ekqrResponse.data.order_id.toString(),
        gateway_response: {
          client_txn_id: clientTxnId,
          ekqr_order_id: ekqrResponse.data.order_id,
          payment_url: ekqrResponse.data.payment_url,
          upi_intent: ekqrResponse.data.upi_intent,
          created_at: new Date().toISOString()
        }
      })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to store payment transaction')
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          orderId: ekqrResponse.data.order_id,
          paymentUrl: ekqrResponse.data.payment_url,
          upiIntent: ekqrResponse.data.upi_intent,
          clientTxnId: clientTxnId
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error creating EKQR order:', error)
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
