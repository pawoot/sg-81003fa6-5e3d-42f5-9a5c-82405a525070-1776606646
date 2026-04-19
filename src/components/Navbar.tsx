import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { GlobalSearch } from "./GlobalSearch";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
  { href: "/", label: "หน้าแรก" },
  { href: "/policies", label: "นโยบายทั้งหมด" },
  { href: "/#clusters", label: "กลุ่มยุทธศาสตร์" }];


  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center" style={{ backgroundColor: "#f97316", backgroundImage: "none" }}>
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-heading font-bold text-lg text-foreground hidden sm:block">
              PolicyWatch Thailand
            </span>
            <span className="font-heading font-bold text-lg text-foreground sm:hidden">
              PolicyWatch
            </span>
          </Link>

          {/* Desktop Search - Center */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <GlobalSearch />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) =>
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary font-medium transition-colors whitespace-nowrap">
              
                {link.label}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
            
            {isMobileMenuOpen ?
            <X className="w-6 h-6" /> :

            <Menu className="w-6 h-6" />
            }
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <GlobalSearch />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen &&
        <div className="md:hidden py-4 border-t border-border">
            {navLinks.map((link) =>
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors">
            
                {link.label}
              </Link>
          )}
          </div>
        }
      </div>
    </nav>);

}