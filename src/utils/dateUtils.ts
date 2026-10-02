import { DurationType, Language } from '../types';

export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getTodayDateString(): string {
  return formatDateToISO(new Date());
}

export function getCurrentMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthStringFromDate(dateStr: string): string {
  return dateStr.slice(0, 7);
}

// Return ISO Week string e.g. "2026-W40"
export function getISOWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// Week range: Monday to Sunday
export function getWeekDateRange(date: Date): { start: string; end: string } {
  const d = new Date(date);
  const day = d.getDay();
  // day: 0 is Sunday, 1 is Monday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: formatDateToISO(monday),
    end: formatDateToISO(sunday),
  };
}

// Month range: 1st to last day of month
export function getMonthDateRange(yearMonth: string): { start: string; end: string } {
  const [y, m] = yearMonth.split('-').map(Number);
  const firstDay = new Date(y, m - 1, 1);
  const lastDay = new Date(y, m, 0);
  return {
    start: formatDateToISO(firstDay),
    end: formatDateToISO(lastDay),
  };
}

// Year range: Jan 1 to Dec 31
export function getYearDateRange(year: number): { start: string; end: string } {
  return {
    start: `${year}-01-01`,
    end: `${year}-12-31`,
  };
}

export function getPeriodKey(date: Date, durationType: DurationType): string {
  if (durationType === 'weekly') {
    return getISOWeekKey(date);
  } else if (durationType === 'monthly') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  } else {
    return `${date.getFullYear()}`;
  }
}

export function getPeriodDateRange(date: Date, durationType: DurationType): { start: string; end: string } {
  if (durationType === 'weekly') {
    return getWeekDateRange(date);
  } else if (durationType === 'monthly') {
    const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return getMonthDateRange(ym);
  } else {
    return getYearDateRange(date.getFullYear());
  }
}

export function getPeriodLabel(periodKey: string, durationType: DurationType, lang: Language): string {
  if (durationType === 'weekly') {
    const [year, weekPart] = periodKey.split('-W');
    return lang === 'zh' ? `${year} 年第 ${weekPart} 週` : `Week ${weekPart}, ${year}`;
  } else if (durationType === 'monthly') {
    const [year, month] = periodKey.split('-');
    const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mIdx = parseInt(month, 10) - 1;
    return lang === 'zh' ? `${year} 年 ${parseInt(month, 10)} 月` : `${monthNamesEn[mIdx]} ${year}`;
  } else {
    return lang === 'zh' ? `${periodKey} 年度` : `Year ${periodKey}`;
  }
}

// Backfill rule: strictly past 7 days, no future dates
export function isDateWithinBackfillRange(dateStr: string): boolean {
  const today = getTodayDateString();
  if (dateStr > today) return false;

  const targetDate = parseISODate(dateStr);
  const nowDate = parseISODate(today);
  const diffTime = nowDate.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 && diffDays <= 7;
}

export function getPast7DaysDates(): { dateStr: string; label: string; dayName: string; isToday: boolean }[] {
  const results = [];
  const today = new Date();
  
  for (let i = 0; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDateToISO(d);
    results.push({
      dateStr,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
      isToday: i === 0,
    });
  }
  return results;
}

export function formatFriendlyDate(dateStr: string, lang: Language): string {
  const d = parseISODate(dateStr);
  const today = getTodayDateString();
  
  if (dateStr === today) {
    return lang === 'zh' ? '今日' : 'Today';
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === formatDateToISO(yesterday)) {
    return lang === 'zh' ? '尋日' : 'Yesterday';
  }

  if (lang === 'zh') {
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}
