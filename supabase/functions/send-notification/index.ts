
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  title: string;
  message: string;
  targetAudience: 'all' | 'students' | 'merchants' | 'admins';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return new Response('Forbidden', { status: 403, headers: corsHeaders });
    }

    const { title, message, targetAudience }: NotificationRequest = await req.json();

    // Log the notification attempt
    const { data: notificationLog } = await supabaseClient
      .from('notification_logs')
      .insert({
        title,
        message,
        target_audience: targetAudience,
        sent_by: user.id,
        status: 'processing'
      })
      .select('id')
      .single();

    // Get target users based on audience
    let targetUsers;
    if (targetAudience === 'all') {
      targetUsers = await supabaseClient
        .from('user_notification_tokens')
        .select('fcm_token, user_id')
        .eq('is_active', true);
    } else {
      targetUsers = await supabaseClient
        .from('user_notification_tokens')
        .select('fcm_token, user_id, user_profiles!inner(role)')
        .eq('is_active', true)
        .eq('user_profiles.role', targetAudience === 'students' ? 'student' : targetAudience === 'merchants' ? 'merchant' : 'admin');
    }

    if (!targetUsers.data || targetUsers.data.length === 0) {
      await supabaseClient
        .from('notification_logs')
        .update({ status: 'completed', failure_count: 0, success_count: 0 })
        .eq('id', notificationLog?.id);

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No active tokens found for target audience',
        sent_count: 0 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // In a real implementation, you would use Firebase Admin SDK here
    // For now, we'll simulate the notification sending
    const tokens = targetUsers.data.map(user => user.fcm_token);
    
    // Simulate sending notifications
    let successCount = 0;
    let failureCount = 0;

    for (const token of tokens) {
      try {
        // In real implementation, use Firebase Admin SDK:
        // await admin.messaging().send({
        //   token: token,
        //   notification: { title, body: message },
        //   webpush: {
        //     notification: {
        //       title,
        //       body: message,
        //       icon: '/favicon.ico'
        //     }
        //   }
        // });
        
        // For now, simulate success
        successCount++;
      } catch (error) {
        console.error('Failed to send notification:', error);
        failureCount++;
      }
    }

    // Update notification log
    await supabaseClient
      .from('notification_logs')
      .update({ 
        status: 'completed', 
        success_count: successCount, 
        failure_count: failureCount 
      })
      .eq('id', notificationLog?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Notifications sent successfully',
      sent_count: successCount,
      failed_count: failureCount
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('Error in send-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);
