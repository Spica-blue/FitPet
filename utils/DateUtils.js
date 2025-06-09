export function formatDateLocal(date) {
  const y  = date.getFullYear();
  const m  = String(date.getMonth() + 1).padStart(2, '0');
  const d  = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayKstString() {
  // 'YYYY-MM-DD' 형식
  return new Date().toLocaleDateString("sv", {
    timeZone: "Asia/Seoul"
  });
}