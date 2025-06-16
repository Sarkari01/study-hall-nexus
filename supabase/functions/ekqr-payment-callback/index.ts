
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

    const url = new URL(req.url)
    const searchParams = url.searchParams
    
    // Extract callback parameters
    const clientTxnId = searchParams.get('client_txn_id')
    const status = searchParams.get('status')
    const amount = searchParams.get('amount')
    const orderId = searchParams.get('order_id')

    console.log('EKQR payment callback:', { clientTxnId, status, amount, orderId })

    if (!clientTxnId) {
      throw new Error('Missing client transaction ID')
    }

    // Find the payment transaction
    const { data: paymentTransaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('gateway_response->client_txn_id', clientTxnId)
      .single()

    if (fetchError) {
      console.error('Error fetching payment transaction:', fetchError)
      throw new Error('Payment transaction not found')
    }

    // Update payment status
    let newStatus = 'pending'
    let bookingStatus = 'pending'
    
    switch (status?.toLowerCase()) {
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

    // Update payment transaction
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        payment_status: newStatus,
        gateway_response: {
          ...paymentTransaction.gateway_response,
          callback_data: {
            status,
            amount,
            order_id: orderId,
            received_at: new Date().toISOString()
          }
        }
      })
      .eq('id', paymentTransaction.id)

    if (updateError) {
      console.error('Error updating payment transaction:', updateError)
      throw new Error('Failed to update payment status')
    }

    // Update booking status if payment completed
    if (newStatus === 'completed' && paymentTransaction.booking_id) {
      await supabase
        .from('bookings')
        .update({
          status: bookingStatus,
          payment_status: newStatus
        })
        .eq('id', paymentTransaction.booking_id)
    }

    // Redirect to success/failure page based on status
    const redirectUrl = newStatus === 'completed' 
      ? `${url.origin}/student?payment=success&booking=${paymentTransaction.booking_id}`
      : `${url.origin}/student?payment=failed&booking=${paymentTransaction.booking_id}`

    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        ...corsHeaders
      }
    })

  } catch (error) {
    console.error('Error processing EKQR callback:', error)
    
    // Redirect to error page
    const url = new URL(req.url)
    const errorUrl = `${url.origin}/student?payment=error`
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': errorUrl,
        ...corsHeaders
      }
    })
  }
})
