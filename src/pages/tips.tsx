import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { TipsForm } from "@/components/TipsForm";
import { getAllPolicies } from "@/services/policyService";
import { MessageSquare, Shield, Eye } from "lucide-react";

export default function TipsPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPolicies() {
      const data = await getAllPolicies();
      setPolicies(data.map(p => ({
        id: p.id,
        policy_number: p.policy_number,
        title: p.title,
      })));
      setLoading(false);
    }
    loadPolicies();
  }, []);

  return (
    <>
      <SEO 
        title="ส่งเบาะแส | PolicyWatch Thailand"
        description="ส่งเบาะแสหรือข้อมูลเกี่ยวกับนโยบายรัฐบาลอนุทิน 2 ช่วยตรวจสอบว่า 'พูดแล้วทำ' จริงหรือไม่"
      />
      <Navbar />

      <main className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading font-bold text-4xl mb-4">
              ส่งเบาะแสจากประชาชน
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              มีข้อมูลหรือเบาะแสเกี่ยวกับนโยบายรัฐบาล? ช่วยเราตรวจสอบว่า <strong>"พูดแล้วทำ"</strong> จริงหรือไม่
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-muted/50 rounded-xl p-8 mb-12">
            <h2 className="font-heading font-semibold text-xl mb-6 text-center">
              🔍 ระบบทำงานอย่างไร
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">1. ส่งเบาะแส</h3>
                <p className="text-sm text-muted-foreground">
                  กรอกฟอร์มด้านล่าง ระบุรายละเอียดและหลักฐาน (ถ้ามี)
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3">
                  <Eye className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2">2. ทีมงานตรวจสอบ</h3>
                <p className="text-sm text-muted-foreground">
                  ทีมงานจะตรวจสอบความถูกต้องและเกี่ยวข้อง
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mb-3">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">3. เผยแพร่</h3>
                <p className="text-sm text-muted-foreground">
                  เบาะแสที่ผ่านการตรวจสอบจะปรากฏในหน้านโยบาย
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
            <h2 className="font-heading font-semibold text-2xl mb-6">
              แบบฟอร์มส่งเบาะแส
            </h2>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                กำลังโหลดรายการนโยบาย...
              </div>
            ) : (
              <TipsForm policies={policies} />
            )}
          </div>

          {/* Guidelines */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-heading font-semibold text-lg mb-4 text-blue-900">
              📌 แนวทางการส่งเบาะแส
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="shrink-0">✓</span>
                <span>ระบุรายละเอียดที่ชัดเจน — สถานที่, เวลา, และเหตุการณ์ที่พบ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">✓</span>
                <span>แนบหลักฐาน — ลิงก์ข่าว, รูปภาพ, เอกสาร (ถ้ามี)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">✓</span>
                <span>ตรวจสอบความถูกต้อง — ข้อมูลควรเป็นจริงและตรวจสอบได้</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">✓</span>
                <span>เลือกนโยบายที่เกี่ยวข้อง — ช่วยให้ทีมงานจัดหมวดหมู่ได้ถูกต้อง</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}