
import { z } from 'zod';

export const merchantSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  business_phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  contact_number: z.string().min(10, 'Contact number must be at least 10 digits'),
  email: z.string().email('Invalid email address').optional(),
  business_address: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(6, 'Pincode must be at least 6 characters')
  }),
  communication_address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional()
  }).optional(),
  incharge_name: z.string().optional(),
  incharge_designation: z.string().optional(),
  incharge_phone: z.string().optional(),
  incharge_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  incharge_address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional()
  }).optional(),
  bank_account_details: z.object({
    account_number: z.string().optional(),
    ifsc_code: z.string().optional(),
    bank_name: z.string().optional(),
    account_holder_name: z.string().optional()
  }).optional(),
  approval_status: z.enum(['pending', 'approved', 'rejected']).optional(),
  verification_status: z.enum(['unverified', 'pending', 'verified', 'rejected']).optional(),
  notes: z.string().optional()
});

export type MerchantFormData = z.infer<typeof merchantSchema>;
