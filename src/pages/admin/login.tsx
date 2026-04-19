import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { signIn } from "@/lib/auth";
import { LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.push("/admin");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <SEO 
        title="เข้าสู่ระบบ Admin | PolicyWatch Thailand"
        description="เข้าสู่ระบบผู้ดูแลระบบ PolicyWatch Thailand"
      />

      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <h1 className="font-heading font-bold text-3xl mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">PolicyWatch Thailand</p>
          </div>

          {/* Login Card */}
          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            <h2 className="font-heading font-semibold text-xl mb-6">เข้าสู่ระบบ</h2>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm text-destructive">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  อีเมล
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="admin@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  รหัสผ่าน
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    เข้าสู่ระบบ
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <Link href="/" className="text-sm text-primary hover:underline">
                ← กลับไปหน้าหลัก
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ระบบสำหรับผู้ดูแลเท่านั้น
          </p>
        </div>
      </div>
    </>
  );
}