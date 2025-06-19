export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          context: Json | null
          created_at: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          session_id: string | null
          severity: string
          timestamp: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          context?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          session_id?: string | null
          severity: string
          timestamp?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          context?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          session_id?: string | null
          severity?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          priority: number | null
          start_date: string | null
          target_audience: string[] | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          priority?: number | null
          start_date?: string | null
          target_audience?: string[] | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          priority?: number | null
          start_date?: string | null
          target_audience?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      booking_seats: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          seat_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          seat_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          seat_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_booking_seats_booking"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          booking_reference: string
          created_at: string
          end_time: string
          final_amount: number
          id: string
          payment_status: string | null
          start_time: string
          status: string | null
          student_id: string | null
          study_hall_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          booking_date: string
          booking_reference?: string
          created_at?: string
          end_time: string
          final_amount?: number
          id?: string
          payment_status?: string | null
          start_time: string
          status?: string | null
          student_id?: string | null
          study_hall_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          booking_date?: string
          booking_reference?: string
          created_at?: string
          end_time?: string
          final_amount?: number
          id?: string
          payment_status?: string | null
          start_time?: string
          status?: string | null
          student_id?: string | null
          study_hall_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_study_hall_id_fkey"
            columns: ["study_hall_id"]
            isOneToOne: false
            referencedRelation: "study_halls"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          attachments: string[] | null
          content: string | null
          created_at: string
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          message_type: string | null
          reply_to_id: string | null
          room_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          content?: string | null
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          message_type?: string | null
          reply_to_id?: string | null
          room_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          content?: string | null
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          message_type?: string | null
          reply_to_id?: string | null
          room_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          id: string
          joined_at: string
          last_read_at: string | null
          role: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          last_read_at?: string | null
          role?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          last_read_at?: string | null
          role?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          study_hall_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          study_hall_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          study_hall_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          images: string[] | null
          is_approved: boolean | null
          likes_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          images?: string[] | null
          is_approved?: boolean | null
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          images?: string[] | null
          is_approved?: boolean | null
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          id: string
          images: string[] | null
          is_approved: boolean | null
          is_pinned: boolean | null
          likes_count: number | null
          post_type: string | null
          study_hall_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          images?: string[] | null
          is_approved?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          post_type?: string | null
          study_hall_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          images?: string[] | null
          is_approved?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          post_type?: string | null
          study_hall_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coupon_usage: {
        Row: {
          coupon_id: string
          discount_amount: number
          final_amount: number
          id: string
          order_id: string | null
          original_amount: number
          subscription_id: string | null
          used_at: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          discount_amount: number
          final_amount: number
          id?: string
          order_id?: string | null
          original_amount: number
          subscription_id?: string | null
          used_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          discount_amount?: number
          final_amount?: number
          id?: string
          order_id?: string | null
          original_amount?: number
          subscription_id?: string | null
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          created_by: string
          description: string | null
          discount_type: string
          discount_value: number
          eligible_plan_ids: string[] | null
          eligible_user_types: string[] | null
          id: string
          is_active: boolean | null
          maximum_discount: number | null
          minimum_amount: number | null
          name: string
          updated_at: string
          usage_limit_per_user: number | null
          usage_limit_total: number | null
          used_count: number | null
          valid_from: string
          valid_until: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          description?: string | null
          discount_type: string
          discount_value: number
          eligible_plan_ids?: string[] | null
          eligible_user_types?: string[] | null
          id?: string
          is_active?: boolean | null
          maximum_discount?: number | null
          minimum_amount?: number | null
          name: string
          updated_at?: string
          usage_limit_per_user?: number | null
          usage_limit_total?: number | null
          used_count?: number | null
          valid_from: string
          valid_until: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          eligible_plan_ids?: string[] | null
          eligible_user_types?: string[] | null
          id?: string
          is_active?: boolean | null
          maximum_discount?: number | null
          minimum_amount?: number | null
          name?: string
          updated_at?: string
          usage_limit_per_user?: number | null
          usage_limit_total?: number | null
          used_count?: number | null
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      custom_roles: {
        Row: {
          color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_system_role: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      merchant_documents: {
        Row: {
          created_at: string | null
          document_name: string | null
          document_type: string
          document_url: string
          file_size: number | null
          id: string
          merchant_id: string | null
          mime_type: string | null
          rejection_reason: string | null
          updated_at: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_name?: string | null
          document_type: string
          document_url: string
          file_size?: number | null
          id?: string
          merchant_id?: string | null
          mime_type?: string | null
          rejection_reason?: string | null
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_name?: string | null
          document_type?: string
          document_url?: string
          file_size?: number | null
          id?: string
          merchant_id?: string | null
          mime_type?: string | null
          rejection_reason?: string | null
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_documents_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchant_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_profiles: {
        Row: {
          aadhaar_card_url: string | null
          approval_status: string | null
          bank_account_details: Json | null
          business_address: Json
          business_logo_url: string | null
          business_name: string
          business_phone: string
          communication_address: Json | null
          contact_number: string
          created_at: string | null
          created_by: string | null
          email: string | null
          full_name: string
          id: string
          incharge_address: Json | null
          incharge_designation: string | null
          incharge_email: string | null
          incharge_name: string | null
          incharge_phone: string | null
          notes: string | null
          onboarding_completed: boolean | null
          refundable_security_deposit: number | null
          slide_images: string[] | null
          trade_license_url: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          aadhaar_card_url?: string | null
          approval_status?: string | null
          bank_account_details?: Json | null
          business_address: Json
          business_logo_url?: string | null
          business_name: string
          business_phone: string
          communication_address?: Json | null
          contact_number: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          full_name: string
          id?: string
          incharge_address?: Json | null
          incharge_designation?: string | null
          incharge_email?: string | null
          incharge_name?: string | null
          incharge_phone?: string | null
          notes?: string | null
          onboarding_completed?: boolean | null
          refundable_security_deposit?: number | null
          slide_images?: string[] | null
          trade_license_url?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          aadhaar_card_url?: string | null
          approval_status?: string | null
          bank_account_details?: Json | null
          business_address?: Json
          business_logo_url?: string | null
          business_name?: string
          business_phone?: string
          communication_address?: Json | null
          contact_number?: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          full_name?: string
          id?: string
          incharge_address?: Json | null
          incharge_designation?: string | null
          incharge_email?: string | null
          incharge_name?: string | null
          incharge_phone?: string | null
          notes?: string | null
          onboarding_completed?: boolean | null
          refundable_security_deposit?: number | null
          slide_images?: string[] | null
          trade_license_url?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      merchant_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          end_date: string
          id: string
          merchant_id: string
          plan_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          end_date: string
          id?: string
          merchant_id: string
          plan_id: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          end_date?: string
          id?: string
          merchant_id?: string
          plan_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          author_id: string
          category_id: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_breaking: boolean | null
          is_featured: boolean | null
          likes_count: number | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          video_url: string | null
          views_count: number | null
        }
        Insert: {
          author_id: string
          category_id?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_breaking?: boolean | null
          is_featured?: boolean | null
          likes_count?: number | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          video_url?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_breaking?: boolean | null
          is_featured?: boolean | null
          likes_count?: number | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "news_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      news_categories: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news_comments: {
        Row: {
          article_id: string | null
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          likes_count: number | null
          parent_comment_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          article_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          likes_count?: number | null
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          article_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          likes_count?: number | null
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "news_articles_with_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "news_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      news_likes: {
        Row: {
          article_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          article_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          article_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_likes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_likes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "news_articles_with_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_views: {
        Row: {
          article_id: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          article_id?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          article_id?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "news_articles_with_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          created_at: string | null
          failure_count: number | null
          id: string
          message: string
          sent_at: string | null
          sent_by: string | null
          status: string | null
          success_count: number | null
          target_audience: string
          title: string
        }
        Insert: {
          created_at?: string | null
          failure_count?: number | null
          id?: string
          message: string
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
          success_count?: number | null
          target_audience?: string
          title: string
        }
        Update: {
          created_at?: string | null
          failure_count?: number | null
          id?: string
          message?: string
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
          success_count?: number | null
          target_audience?: string
          title?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string | null
          gateway_response: Json | null
          gateway_transaction_id: string | null
          id: string
          payment_method: string
          payment_status: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          payment_method: string
          payment_status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          payment_method?: string
          payment_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_transactions_booking"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          module: string
          name: string
          updated_at: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          module: string
          name: string
          updated_at?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          module?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reward_history: {
        Row: {
          amount_earned: number | null
          created_at: string
          id: string
          points_earned: number
          processed_at: string | null
          processed_by: string | null
          rule_id: string
          status: string
          trigger_data: Json | null
          user_id: string
        }
        Insert: {
          amount_earned?: number | null
          created_at?: string
          id?: string
          points_earned: number
          processed_at?: string | null
          processed_by?: string | null
          rule_id: string
          status?: string
          trigger_data?: Json | null
          user_id: string
        }
        Update: {
          amount_earned?: number | null
          created_at?: string
          id?: string
          points_earned?: number
          processed_at?: string | null
          processed_by?: string | null
          rule_id?: string
          status?: string
          trigger_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_history_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "reward_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_rules: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          reward_amount: number | null
          reward_points: number
          trigger_condition: Json | null
          trigger_type: string
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          reward_amount?: number | null
          reward_points: number
          trigger_condition?: Json | null
          trigger_type: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          reward_amount?: number | null
          reward_points?: number
          trigger_condition?: Json | null
          trigger_type?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      seat_layouts: {
        Row: {
          created_at: string
          id: string
          is_available: boolean
          row_number: number
          seat_id: string
          seat_number: number
          seat_type: string | null
          study_hall_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_available?: boolean
          row_number: number
          seat_id: string
          seat_number: number
          seat_type?: string | null
          study_hall_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_available?: boolean
          row_number?: number
          seat_id?: string
          seat_number?: number
          seat_type?: string | null
          study_hall_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_seat_layouts_study_hall"
            columns: ["study_hall_id"]
            isOneToOne: false
            referencedRelation: "study_halls"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          average_session_duration: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          last_booking_date: string | null
          phone: string
          preferred_study_halls: string[] | null
          status: string | null
          student_id: string
          total_bookings: number | null
          total_spent: number | null
          updated_at: string
        }
        Insert: {
          average_session_duration?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          last_booking_date?: string | null
          phone: string
          preferred_study_halls?: string[] | null
          status?: string | null
          student_id?: string
          total_bookings?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Update: {
          average_session_duration?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_booking_date?: string | null
          phone?: string
          preferred_study_halls?: string[] | null
          status?: string | null
          student_id?: string
          total_bookings?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      study_halls: {
        Row: {
          amenities: string[] | null
          capacity: number
          created_at: string
          description: string | null
          id: string
          is_featured: boolean | null
          location: string
          merchant_id: string | null
          name: string
          operating_hours: Json | null
          price_per_day: number
          price_per_month: number | null
          price_per_week: number | null
          rating: number | null
          status: string | null
          total_bookings: number | null
          total_revenue: number | null
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          location: string
          merchant_id?: string | null
          name: string
          operating_hours?: Json | null
          price_per_day?: number
          price_per_month?: number | null
          price_per_week?: number | null
          rating?: number | null
          status?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          location?: string
          merchant_id?: string | null
          name?: string
          operating_hours?: Json | null
          price_per_day?: number
          price_per_month?: number | null
          price_per_week?: number | null
          rating?: number | null
          status?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      subscription_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          gateway_transaction_id: string | null
          id: string
          invoice_url: string | null
          payment_date: string
          payment_gateway: string | null
          payment_method: string | null
          status: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          gateway_transaction_id?: string | null
          id?: string
          invoice_url?: string | null
          payment_date?: string
          payment_gateway?: string | null
          payment_method?: string | null
          status?: string
          subscription_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          gateway_transaction_id?: string | null
          id?: string
          invoice_url?: string | null
          payment_date?: string
          payment_gateway?: string | null
          payment_method?: string | null
          status?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "merchant_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          auto_renew_enabled: boolean | null
          billing_period: string
          created_at: string
          description: string | null
          features: Json | null
          has_analytics: boolean | null
          has_chat_support: boolean | null
          id: string
          is_active: boolean | null
          is_trial: boolean | null
          max_cabins: number | null
          max_study_halls: number | null
          name: string
          price: number
          trial_days: number | null
          updated_at: string
          validity_days: number
        }
        Insert: {
          auto_renew_enabled?: boolean | null
          billing_period: string
          created_at?: string
          description?: string | null
          features?: Json | null
          has_analytics?: boolean | null
          has_chat_support?: boolean | null
          id?: string
          is_active?: boolean | null
          is_trial?: boolean | null
          max_cabins?: number | null
          max_study_halls?: number | null
          name: string
          price: number
          trial_days?: number | null
          updated_at?: string
          validity_days: number
        }
        Update: {
          auto_renew_enabled?: boolean | null
          billing_period?: string
          created_at?: string
          description?: string | null
          features?: Json | null
          has_analytics?: boolean | null
          has_chat_support?: boolean | null
          id?: string
          is_active?: boolean | null
          is_trial?: boolean | null
          max_cabins?: number | null
          max_study_halls?: number | null
          name?: string
          price?: number
          trial_days?: number | null
          updated_at?: string
          validity_days?: number
        }
        Relationships: []
      }
      user_notification_tokens: {
        Row: {
          created_at: string | null
          device_type: string | null
          fcm_token: string
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_type?: string | null
          fcm_token: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_type?: string | null
          fcm_token?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          custom_role_id: string | null
          full_name: string | null
          id: string
          merchant_id: string | null
          phone: string | null
          role: string | null
          study_hall_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          custom_role_id?: string | null
          full_name?: string | null
          id?: string
          merchant_id?: string | null
          phone?: string | null
          role?: string | null
          study_hall_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          custom_role_id?: string | null
          full_name?: string | null
          id?: string
          merchant_id?: string | null
          phone?: string | null
          role?: string | null
          study_hall_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_custom_role_id_fkey"
            columns: ["custom_role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          reward_points: number
          total_earned: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          reward_points?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          reward_points?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          description: string
          id: string
          points: number | null
          reference_id: string | null
          reference_type: string | null
          status: string
          transaction_type: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          points?: number | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          transaction_type: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          points?: number | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          transaction_type?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "user_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      news_articles_with_profiles: {
        Row: {
          author_avatar: string | null
          author_id: string | null
          author_name: string | null
          category_color: string | null
          category_id: string | null
          category_name: string | null
          comments_count: number | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string | null
          is_breaking: boolean | null
          is_featured: boolean | null
          likes_count: number | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string | null
          status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          video_url: string | null
          views_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "news_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_merchant_with_auth: {
        Args: {
          p_email: string
          p_password: string
          p_business_name: string
          p_business_phone: string
          p_full_name: string
          p_contact_number: string
          p_business_address: Json
          p_communication_address?: Json
          p_bank_account_details?: Json
          p_incharge_name?: string
          p_incharge_designation?: string
          p_incharge_phone?: string
          p_incharge_email?: string
          p_incharge_address?: Json
          p_refundable_security_deposit?: number
          p_approval_status?: string
          p_notes?: string
        }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role_secure: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_permissions: {
        Args: { user_id: string }
        Returns: {
          permission_name: string
          permission_description: string
          module: string
          action: string
        }[]
      }
      get_user_permissions_safe: {
        Args: { user_id: string }
        Returns: {
          permission_name: string
          permission_description: string
          module: string
          action: string
        }[]
      }
      get_user_role_safe: {
        Args: { user_id: string }
        Returns: string
      }
      has_role_secure: {
        Args: { role_name: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_secure: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_has_permission: {
        Args: { user_id: string; permission_name: string }
        Returns: boolean
      }
    }
    Enums: {
      system_role: "super_admin" | "admin" | "moderator" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      system_role: ["super_admin", "admin", "moderator", "editor", "viewer"],
    },
  },
} as const
