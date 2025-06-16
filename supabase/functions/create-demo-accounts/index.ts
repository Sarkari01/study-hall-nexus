
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Creating demo admin accounts...')

    // Demo accounts to create
    const demoAccounts = [
      {
        email: 'superadmin@demo.com',
        password: 'SuperAdmin123!',
        fullName: 'Super Admin',
        role: 'admin'
      },
      {
        email: 'admin@demo.com',
        password: 'Admin123!',
        fullName: 'Admin User',
        role: 'admin'
      }
    ]

    const results = []

    for (const account of demoAccounts) {
      console.log(`Creating account for ${account.email}...`)
      
      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(account.email)
      
      if (existingUser?.user) {
        console.log(`User ${account.email} already exists, skipping creation`)
        results.push({
          email: account.email,
          status: 'already_exists',
          userId: existingUser.user.id
        })
        continue
      }

      // Create the user using admin API
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: account.fullName
        }
      })

      if (createError) {
        console.error(`Error creating user ${account.email}:`, createError)
        results.push({
          email: account.email,
          status: 'error',
          error: createError.message
        })
        continue
      }

      if (!newUser?.user) {
        console.error(`Failed to create user ${account.email}: No user returned`)
        results.push({
          email: account.email,
          status: 'error',
          error: 'No user returned from creation'
        })
        continue
      }

      console.log(`User created successfully: ${newUser.user.id}`)

      // Get the admin role ID
      const { data: adminRole, error: roleError } = await supabaseAdmin
        .from('custom_roles')
        .select('id')
        .eq('name', 'admin')
        .eq('is_system_role', true)
        .single()

      if (roleError || !adminRole) {
        console.error('Failed to get admin role:', roleError)
        results.push({
          email: account.email,
          status: 'user_created_role_failed',
          userId: newUser.user.id,
          error: 'Failed to get admin role'
        })
        continue
      }

      // Create user profile with admin role
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: newUser.user.id,
          full_name: account.fullName,
          role: 'admin',
          custom_role_id: adminRole.id
        })

      if (profileError) {
        console.error(`Failed to create profile for ${account.email}:`, profileError)
        results.push({
          email: account.email,
          status: 'user_created_profile_failed',
          userId: newUser.user.id,
          error: profileError.message
        })
        continue
      }

      // Create user wallet
      const { error: walletError } = await supabaseAdmin
        .from('user_wallets')
        .insert({
          user_id: newUser.user.id
        })

      if (walletError) {
        console.error(`Failed to create wallet for ${account.email}:`, walletError)
        // Don't fail the whole process for wallet creation error
      }

      console.log(`Successfully created admin account: ${account.email}`)
      results.push({
        email: account.email,
        status: 'success',
        userId: newUser.user.id
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo admin accounts creation process completed',
        results: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in create-demo-accounts function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
