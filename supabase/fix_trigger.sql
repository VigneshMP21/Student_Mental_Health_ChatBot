-- Run this in Supabase SQL Editor to ensure the auto-profile trigger exists.
-- This creates the public.users record automatically when a new auth user signs up.

-- Recreate the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.wellness_streaks (user_id, current_streak, longest_streak)
  VALUES (NEW.id, 0, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify existing users in auth.users that are missing from public.users
-- and create their records
INSERT INTO public.users (id, name, email)
SELECT
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  au.email
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
  AND au.email IS NOT NULL;

INSERT INTO public.wellness_streaks (user_id, current_streak, longest_streak)
SELECT
  au.id, 0, 0
FROM auth.users au
LEFT JOIN public.wellness_streaks ws ON ws.user_id = au.id
WHERE ws.user_id IS NULL;
