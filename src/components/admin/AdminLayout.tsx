import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getSession, signOut } from "@/lib/auth";
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  LogOut,
  Menu,
  X
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await getSession();
        
        if (!session) {
          router.push("/admin/login");
          return;
        }
        
        setUserEmail(session.user.email || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/admin/login");
      }
    }
    
    checkAuth();
  }, [router]);

  async function handleSignOut() {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/policies", label: "จัดการนโยบาย", icon: FileText },
    { href: "/admin/updates", label: "รีวิวอัปเดต", icon: CheckSquare },
    { href: "/admin/tips", label: "เบาะแสประชาชน", icon: MessageSquare },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="font-heading font-bold text-lg">
          Admin Panel
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border
            transform transition-transform duration-200 ease-in-out z-40
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="p-6 border-b border-border hidden lg:block">
            <Link href="/admin" className="font-heading font-bold text-xl">
              Admin Panel
            </Link>
            <p className="text-sm text-muted-foreground mt-1">PolicyWatch Thailand</p>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? router.pathname === item.href
                : router.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? "bg-primary text-white" 
                      : "text-foreground hover:bg-muted"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <div className="mb-3 px-4">
              <p className="text-sm font-medium text-foreground truncate">{userEmail}</p>
              <p className="text-xs text-muted-foreground">ผู้ดูแลระบบ</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">ออกจากระบบ</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}