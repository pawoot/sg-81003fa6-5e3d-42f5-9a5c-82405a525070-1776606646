/**
 * Calculate days remaining until target date
 * Returns negative number if past deadline
 */
export function getDaysRemaining(targetDate: Date | string | null): number | null {
  if (!targetDate) return null;
  
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Get countdown color based on days remaining
 * - Green: > 90 days
 * - Yellow: 30-90 days
 * - Red: < 30 days or past deadline
 */
export function getCountdownColor(daysRemaining: number | null): "green" | "yellow" | "red" {
  if (daysRemaining === null) return "green";
  
  if (daysRemaining > 90) return "green";
  if (daysRemaining >= 30) return "yellow";
  return "red";
}

/**
 * Format date to Thai Buddhist Era
 * Example: "9 เมษายน 2569"
 */
export function toThaiDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  
  const day = d.getDate();
  const month = thaiMonths[d.getMonth()];
  const year = d.getFullYear() + 543; // Convert to Buddhist Era
  
  return `${day} ${month} ${year}`;
}

/**
 * Format number with Thai comma separator
 * Example: 1500000 → "1,500,000"
 */
export function formatThaiNumber(num: number): string {
  return num.toLocaleString("th-TH");
}