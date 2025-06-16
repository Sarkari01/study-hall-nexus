
-- Update the user profile to link it to the merchant role and merchant profile
UPDATE public.user_profiles 
SET 
  custom_role_id = '731d60e7-343a-40ad-a46d-098632f03a59',
  merchant_id = '83916c63-f39f-4d93-a00a-99bcc2860ae0'
WHERE user_id = 'a876379b-4872-4bab-9e3a-6444c887c80b';
