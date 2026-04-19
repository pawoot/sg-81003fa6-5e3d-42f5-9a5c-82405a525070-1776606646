-- Drop old auth-required SELECT policy
DROP POLICY IF EXISTS "auth_select_votes" ON public_votes;

-- Create new public read policy (same as INSERT)
CREATE POLICY "public_read_votes" ON public_votes
  FOR SELECT
  TO public
  USING (true);