import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Target, Eye, Users, Database, MessageSquare, Shield } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const benefits = [
    {
      icon: Eye,
      title: "ความชัดเจน",
      description: "ไม่ต้องอ่านเอกสารราชการหลายร้อยหน้า เราสรุปนโยบาย งบประมาณ และตัวชี้วัดมาให้ในรูปแบบที่เข้าใจง่ายที่สุด",
    },
    {
      icon: Database,
      title: "ข้อมูลเปิด (Open Data)",
      description: "ข้อมูลทุกรายการมีที่มาอ้างอิงชัดเจน และเราผลักดันให้รัฐบาลเปิดเผยข้อมูลในรูปแบบที่คอมพิวเตอร์อ่านได้ (Machine Readable)",
    },
    {
      icon: MessageSquare,
      title: "การมีส่วนร่วม",
      description: "ประชาชนสามารถส่ง \"เบาะแส\" หรือหลักฐานความคืบหน้าโครงการในพื้นที่ เพื่อยืนยันว่าสิ่งที่รัฐรายงานตรงกับความเป็นจริงหรือไม่",
    },
  ];

  return (
    <>
      <SEO 
        title="เกี่ยวกับโครงการ | PolicyWatch Thailand"
        description="แพลตฟอร์มอิสระเพื่อการติดตามและตรวจสอบนโยบายสาธารณะ มุ่งเน้นการเปลี่ยน คำสัญญา ให้กลายเป็น ข้อมูลที่วัดผลได้จริง"
      />
      <Navbar />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-6">
              เกี่ยวกับโครงการ<br />
              <span className="text-primary">PolicyWatch Thailand</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              แพลตฟอร์มอิสระเพื่อการติดตามและตรวจสอบนโยบายสาธารณะ 
              มุ่งเน้นการเปลี่ยน "คำสัญญา" ให้กลายเป็น "ข้อมูลที่วัดผลได้จริง"
            </p>
          </div>
        </section>

        {/* What is this project */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-primary" />
              <h2 className="font-heading font-bold text-3xl">โครงการนี้คืออะไร?</h2>
            </div>
            <p className="text-lg text-foreground leading-relaxed">
              PolicyWatch Thailand คือ "แดshบอร์ดติดตามนโยบาย" (Policy Tracker) 
              ที่รวบรวมนโยบายจากคำแถลงของคณะรัฐมนตรี นายอนุทิน ชาญวีรกูล 
              เมื่อวันที่ 9 เมษายน 2569 มาทำการย่อยข้อมูลให้เป็นรายโครงการ 
              พร้อมกำหนดตัวชี้วัด (KPIs) และไทม์ไลน์ที่ชัดเจน 
              เพื่อให้ประชาชนสามารถติดตามความคืบหน้าได้แบบเรียลไทม์
            </p>
          </div>
        </section>

        {/* Purpose */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-primary" />
              <h2 className="font-heading font-bold text-3xl">ทำมาเพื่ออะไร?</h2>
            </div>
            <p className="text-lg text-foreground leading-relaxed mb-4">
              เราเชื่อว่า <strong>"ความโปร่งใสคือรากฐานของประชาธิปไตย"</strong>
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              โครงการนี้ถูกสร้างขึ้นเพื่อสร้างกลไกการตรวจสอบ (Accountability) 
              ลดช่องว่างระหว่างคำมั่นสัญญากับการปฏิบัติจริง 
              และส่งเสริมให้เกิดการบริหารราชการแผ่นดิน ที่มุ่งเน้นผลสัมฤทธิ์อย่างแท้จริง 
              โดยใช้ข้อมูลเป็นเครื่องมือตัดสินใจ
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-bold text-3xl mb-10 text-center">
              ประโยชน์ที่คุณจะได้รับ
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div 
                    key={benefit.title}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-xl mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Who we are */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-primary" />
              <h2 className="font-heading font-bold text-3xl">ใครคือผู้อยู่เบื้องหลัง?</h2>
            </div>
            <p className="text-lg text-foreground leading-relaxed mb-4">
              โครงการนี้ริเริ่มโดยกลุ่มอาสาสมัครภาคประชาสังคม นักพัฒนาระบบ (Developers) 
              และนักวิชาการอิสระ ที่ต้องการเห็นประเทศไทยก้าวสู่การเป็น 
              <strong> "Data-Driven Democracy"</strong>
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              เราทำงานอย่างเป็นอิสระ ไม่ได้ขึ้นตรงต่อหน่วยงานรัฐบาลใดๆ
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl mb-6">
              พร้อมที่จะร่วมติดตามนโยบายแล้วหรือยัง?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              เริ่มต้นตรวจสอบนโยบาย 23 ข้อ และติดตามความคืบหน้าได้ทันที
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/policies"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                ดูนโยบายทั้งหมด
              </Link>
              <Link
                href="/tips"
                className="inline-flex items-center justify-center px-8 py-3 bg-card border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
              >
                แจ้งเบาะแส
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}