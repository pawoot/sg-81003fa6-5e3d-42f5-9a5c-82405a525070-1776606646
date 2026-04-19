import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <SEO />
      <Navbar />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl text-foreground mb-6">
                พูดแล้วทำ
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                ติดตามความคืบหน้านโยบาย 23 ข้อของรัฐบาลอนุทิน ชาญวีรกูล<br />
                แบบเรียลไทม์ โปร่งใส ตรวจสอบได้
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/policies"
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  ดูนโยบายทั้งหมด
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
                >
                  เกี่ยวกับโครงการ
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">23</div>
                <div className="text-muted-foreground font-medium">นโยบายทั้งหมด</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-accent mb-2">4</div>
                <div className="text-muted-foreground font-medium">กำลังดำเนินการ</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-success mb-2">0</div>
                <div className="text-muted-foreground font-medium">เสร็จสิ้น</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-destructive mb-2">19</div>
                <div className="text-muted-foreground font-medium">ยังไม่เริ่ม/ล่าช้า</div>
              </div>
            </div>
          </div>
        </section>

        {/* Clusters Overview */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-8 text-center">
              5 กลุ่มยุทธศาสตร์
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border-l-4 border-cluster-1 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">💰</span>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-1">เศรษฐกิจ</h3>
                    <p className="text-sm text-muted-foreground">
                      การลงทุน อุตสาหกรรมแห่งอนาคต
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-l-4 border-cluster-2 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🌐</span>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-1">ต่างประเทศ</h3>
                    <p className="text-sm text-muted-foreground">
                      ความมั่นคง การทูต
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-l-4 border-cluster-3 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🌿</span>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-1">สิ่งแวดล้อม</h3>
                    <p className="text-sm text-muted-foreground">
                      โครงสร้างพื้นฐาน พลังงาน
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-l-4 border-cluster-4 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">❤️</span>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-1">สังคม</h3>
                    <p className="text-sm text-muted-foreground">
                      สวัสดิการ สาธารณสุข การศึกษา
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-l-4 border-cluster-5 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">⚖️</span>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-1">บริหารภาครัฐ</h3>
                    <p className="text-sm text-muted-foreground">
                      ปฏิรูปกฎหมาย แก้คอร์รัปชัน
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Policies */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-8 text-center">
              นโยบายด่วนที่ต้องจับตา
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 bg-destructive/10 text-destructive text-sm font-semibold rounded-full">
                    ด่วนที่สุด
                  </span>
                  <span className="text-sm text-muted-foreground">เหลือ 170 วัน</span>
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  Super License — กฎหมายอำนวยความสะดวก
                </h3>
                <p className="text-muted-foreground mb-4">
                  ผลักดันร่างกฎหมายให้แล้วเสร็จภายใน 180 วัน เพื่อลดภาระประชาชน
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    📅 เป้าหมาย: 6 ตุลาคม 2569
                  </span>
                  <a href="/policies/super-license" className="text-primary hover:underline font-medium">
                    ดูรายละเอียด →
                  </a>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 bg-destructive/10 text-destructive text-sm font-semibold rounded-full">
                    ด่วนที่สุด
                  </span>
                  <span className="text-sm text-muted-foreground">เหลือ 355 วัน</span>
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  Omnibus Law — แก้กฎหมายล้าสมัย
                </h3>
                <p className="text-muted-foreground mb-4">
                  เสนอชุดกฎหมายแก้ปัญหาเศรษฐกิจภายใน 1 ปี
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    📅 เป้าหมาย: 9 เมษายน 2570
                  </span>
                  <a href="/policies/omnibus-law" className="text-primary hover:underline font-medium">
                    ดูรายละเอียด →
                  </a>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full">
                    สำคัญมาก
                  </span>
                  <span className="text-sm text-muted-foreground">เป้าหมาย: ปี 2571</span>
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  เข้า OECD ภายในปี 2571
                </h3>
                <p className="text-muted-foreground mb-4">
                  ยกระดับมาตรฐานอุตสาหกรรมและบริการสู่ระดับสากล
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    📅 เป้าหมาย: 31 ธันวาคม 2571
                  </span>
                  <a href="/policies/oecd-membership" className="text-primary hover:underline font-medium">
                    ดูรายละเอียด →
                  </a>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 bg-success/10 text-success text-sm font-semibold rounded-full">
                    เป้าหมายระยะยาว
                  </span>
                  <span className="text-sm text-muted-foreground">เป้าหมาย: ปี 2593</span>
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  Net Zero 2593
                </h3>
                <p className="text-muted-foreground mb-4">
                  ปล่อยก๊าซเรือนกระจกสุทธิเป็นศูนย์ภายในปี 2050
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    📅 เป้าหมาย: 31 ธันวาคม 2593
                  </span>
                  <a href="/policies/net-zero-2050" className="text-primary hover:underline font-medium">
                    ดูรายละเอียด →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted/30 border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                ข้อมูลจากคำแถลงนโยบายของคณะรัฐมนตรี นายอนุทิน ชาญวีรกูล<br />
                แถลงต่อรัฐสภา วันที่ 9 เมษายน พ.ศ. 2569
              </p>
              <p>
                © {new Date().getFullYear()} PolicyWatch Thailand · 
                <a href="https://github.com" className="hover:text-primary ml-1">GitHub</a> · 
                <a href="https://twitter.com" className="hover:text-primary ml-1">Twitter</a>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}