-- Drop database triggers (ไม่ใช้แล้ว)
DROP TRIGGER IF EXISTS send_update_notification ON progress_updates;
DROP TRIGGER IF EXISTS send_tip_notification ON community_tips;
DROP FUNCTION IF EXISTS notify_new_progress_update();
DROP FUNCTION IF EXISTS notify_new_community_tip();