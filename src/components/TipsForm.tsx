import { useState, FormEvent } from "react";
import { MessageSquare, MapPin, Link as LinkIcon, Send, CheckCircle } from "lucide-react";

interface TipsFormProps {
  policies: Array<{
    id: string;
    policy_number: string;
    title: string;
  }>;
}

export function TipsForm({ policies }: TipsFormProps) {
  const [formData, setFormData] = useState({
    policy_id: "",
    description: "",
    evidence_url: "",
    location_province: "",
    location_district: "",
    submitter_contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit tip");
      }

      // Success
      setSuccess(true);
      setFormData({
        policy_id: "",
        description: "",
        evidence_url: "",
        location_province: "",
        location_district: "",
        submitter_contact: "",
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-success/10 border border-success rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
        <h3 className="font-heading font-semibold text-xl mb-2 text-success">
          ส่งเบาะแสสำเร็จ!
        </h3>
        <p className="text-muted-foreground mb-6">
          ขอบคุณสำหรับข้อมูล เบาะแสของคุณจะได้รับการตรวจสอบจากทีมงาน
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          ส่งเบาะแสเพิ่มเติม
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Policy Selection */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          เลือกนโยบายที่เกี่ยวข้อง <span className="text-destructive">*</span>
        </label>
        <select
          value={formData.policy_id}
          onChange={(e) => setFormData({ ...formData, policy_id: e.target.value })}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="">-- เลือกนโยบาย --</option>
          {policies.map((policy) => (
            <option key={policy.id} value={policy.id}>
              {policy.policy_number} - {policy.title}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground mt-1">
          เลือกนโยบายที่เบาะแสของคุณเกี่ยวข้องด้วย
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          รายละเอียดเบาะแส <span className="text-destructive">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-32"
          placeholder="โปรดระบุรายละเอียดเบาะแส เช่น สถานการณ์ที่พบ, สถานที่, วันที่, หรือข้อมูลอื่นๆ ที่เป็นประโยชน์..."
          required
          minLength={20}
        />
        <p className="text-xs text-muted-foreground mt-1">
          อย่างน้อย 20 ตัวอักษร - ยิ่งละเอียดมากยิ่งดี
        </p>
      </div>

      {/* Evidence URL */}
      <div>
        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
          <LinkIcon className="w-4 h-4" />
          URL หลักฐาน (ถ้ามี)
        </label>
        <input
          type="url"
          value={formData.evidence_url}
          onChange={(e) => setFormData({ ...formData, evidence_url: e.target.value })}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://example.com/evidence"
        />
        <p className="text-xs text-muted-foreground mt-1">
          ลิงก์ไปยังเอกสาร, รูปภาพ, หรือข่าวที่เกี่ยวข้อง
        </p>
      </div>

      {/* Location */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            จังหวัด
          </label>
          <input
            type="text"
            value={formData.location_province}
            onChange={(e) => setFormData({ ...formData, location_province: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="เช่น กรุงเทพฯ, เชียงใหม่"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">
            อำเภอ/เขต
          </label>
          <input
            type="text"
            value={formData.location_district}
            onChange={(e) => setFormData({ ...formData, location_district: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="เช่น บางรัก, เมือง"
          />
        </div>
      </div>

      {/* Contact (Optional) */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          ข้อมูลติดต่อ (ไม่บังคับ)
        </label>
        <input
          type="text"
          value={formData.submitter_contact}
          onChange={(e) => setFormData({ ...formData, submitter_contact: e.target.value })}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="อีเมล หรือ เบอร์โทร (ถ้าต้องการให้ติดต่อกลับ)"
        />
        <p className="text-xs text-muted-foreground mt-1">
          🔒 ข้อมูลจะถูกเข้ารหัสและใช้เฉพาะการติดต่อกลับเท่านั้น
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm">
        <h4 className="font-semibold mb-2">📋 นโยบายความเป็นส่วนตัว</h4>
        <ul className="space-y-1 text-muted-foreground">
          <li>• เบาะแสทั้งหมดจะได้รับการตรวจสอบก่อนเผยแพร่</li>
          <li>• ข้อมูลติดต่อจะถูกเก็บเป็นความลับและเข้ารหัส</li>
          <li>• เบาะแสที่ผ่านการตรวจสอบจะปรากฏใน Activity Log ของนโยบาย</li>
        </ul>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>กำลังส่ง...</>
        ) : (
          <>
            <Send className="w-5 h-5" />
            ส่งเบาะแส
          </>
        )}
      </button>
    </form>
  );
}