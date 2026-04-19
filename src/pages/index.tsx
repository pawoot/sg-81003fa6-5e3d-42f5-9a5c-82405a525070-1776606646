import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { ClusterOverview } from "@/components/dashboard/ClusterOverview";
import { FeaturedPolicies } from "@/components/dashboard/FeaturedPolicies";
import { TrendingUp, Target, CheckCircle } from "lucide-react";
import Link from "next/link";

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
              <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl text-foreground mb-6" style={{ lineHeight: "1", fontSize: "56px", color: "#3b82f6" }}>ติตตามนโยบายรัฐบาลอนุทิน 2

              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                ติดตามความคืบหน้านโยบาย 23 ข้อของรัฐบาลอนุทิน ชาญวีรกูล<br />
                แบบเรียลไทม์ โปร่งใส ตรวจสอบได้
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/policies"
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                  
                  ดูนโยบายทั้งหมด
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors">
                  
                  เกี่ยวกับโครงการ
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HeroStats />
          </div>
        </section>

        {/* Clusters Overview */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-8 text-center">
              5 กลุ่มยุทธศาสตร์
            </h2>
            <ClusterOverview />
          </div>
        </section>

        {/* Featured Policies */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-8 text-center">
              นโยบายด่วนที่ต้องจับตา
            </h2>
            <FeaturedPolicies />
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/policies"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg">
            
            <Target className="w-5 h-5" />
            ดูนโยบายทั้งหมด 23 ข้อ
          </Link>
        </div>

        {/* Footer */}
        <footer className="bg-muted/30 border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                ข้อมูลจากคำแถลงนโยบายของคณะรัฐมนตรี นายอนุทิน ชาญวีรกูล<br />
                แถลงต่อรัฐสภา วันที่ 9 เมษายน พ.ศ. 2569
              </p>
              <p>
                © 2026 PolicyWatch Thailand · 
                <a href="https://github.com" className="hover:text-primary ml-1">GitHub</a> · 
                <a href="https://twitter.com" className="hover:text-primary ml-1">Twitter</a>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>);

}