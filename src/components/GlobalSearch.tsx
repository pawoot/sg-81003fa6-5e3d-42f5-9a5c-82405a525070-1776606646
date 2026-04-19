import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Search, X } from "lucide-react";
import type { PolicyWithDetails } from "@/lib/types";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PolicyWithDetails[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Search function
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
        setIsOpen(data.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          navigateToPolicy(results[selectedIndex].slug);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const navigateToPolicy = (slug: string) => {
    router.push(`/policies/${slug}`);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const highlightMatch = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 text-foreground">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    planned: { label: "วางแผน", color: "bg-blue-100 text-blue-800" },
    in_progress: { label: "กำลังดำเนินการ", color: "bg-yellow-100 text-yellow-800" },
    delayed: { label: "ล่าช้า", color: "bg-orange-100 text-orange-800" },
    completed: { label: "เสร็จสิ้น", color: "bg-green-100 text-green-800" },
    cancelled: { label: "ยกเลิก", color: "bg-gray-100 text-gray-600" },
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder="ค้นหานโยบาย..."
          className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              กำลังค้นหา...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              ไม่พบผลลัพธ์
            </div>
          ) : (
            <div className="py-2">
              {results.map((policy, index) => {
                const statusConfig = STATUS_CONFIG[policy.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.planned;
                return (
                  <button
                    key={policy.id}
                    onClick={() => navigateToPolicy(policy.slug)}
                    className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors ${
                      selectedIndex === index ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            {policy.policy_number}
                          </span>
                          {policy.clusters && (
                            <span className="text-xs" style={{ color: policy.clusters.color_hex }}>
                              {policy.clusters.icon} {policy.clusters.short_name}
                            </span>
                          )}
                        </div>
                        <div className="font-medium text-foreground mb-1 line-clamp-1">
                          {highlightMatch(policy.title, query)}
                        </div>
                        {policy.description && (
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {highlightMatch(policy.description.slice(0, 120), query)}
                          </div>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}