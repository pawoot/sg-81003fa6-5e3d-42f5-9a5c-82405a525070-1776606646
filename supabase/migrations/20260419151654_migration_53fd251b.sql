-- เพิ่ม RLS policies สำหรับ admin จัดการนโยบาย (INSERT, UPDATE, DELETE)
CREATE POLICY "auth_insert_policies" ON policies
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_policies" ON policies
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_policies" ON policies
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- เพิ่ม policies สำหรับตารางที่เกี่ยวข้อง (ถ้ามี RLS enabled)
-- progress_updates ต้องให้ admin สร้าง/แก้ไขได้
CREATE POLICY "auth_insert_updates" ON progress_updates
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_updates" ON progress_updates
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_updates" ON progress_updates
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- community_tips ต้องให้ admin อ่าน/แก้ไขได้
CREATE POLICY "auth_select_tips" ON community_tips
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_tips" ON community_tips
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- public_votes ต้องให้ admin อ่านได้
CREATE POLICY "auth_select_votes" ON public_votes
  FOR SELECT
  USING (auth.uid() IS NOT NULL);