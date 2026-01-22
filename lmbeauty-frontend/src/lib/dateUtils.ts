/**
 * Formats a date as a warm, human-readable relative time string in German.
 * Examples: "vor 3 Wochen", "vor 2 Tagen", "heute"
 */
export function formatRelativeDate(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  const diffMs = now.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'heute';
  }
  
  if (diffDays === 1) {
    return 'gestern';
  }
  
  if (diffDays < 7) {
    return `vor ${diffDays} Tagen`;
  }
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) {
    return 'vor einer Woche';
  }
  
  if (diffWeeks < 4) {
    return `vor ${diffWeeks} Wochen`;
  }
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) {
    return 'vor einem Monat';
  }
  
  if (diffMonths < 12) {
    return `vor ${diffMonths} Monaten`;
  }
  
  const diffYears = Math.floor(diffDays / 365);
  if (diffYears === 1) {
    return 'vor einem Jahr';
  }
  
  return `vor ${diffYears} Jahren`;
}

/**
 * Formats a future date as a warm, human-readable relative time string in German.
 * Examples: "in 5 Tagen", "in 2 Wochen", "morgen"
 */
export function formatFutureRelativeDate(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  // Reset time to compare just dates
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  const diffMs = target.getTime() - nowDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'heute';
  }
  
  if (diffDays === 1) {
    return 'morgen';
  }
  
  if (diffDays === 2) {
    return 'übermorgen';
  }
  
  if (diffDays < 7) {
    return `in ${diffDays} Tagen`;
  }
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) {
    return 'in einer Woche';
  }
  
  if (diffWeeks < 4) {
    return `in ${diffWeeks} Wochen`;
  }
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) {
    return 'in einem Monat';
  }
  
  return `in ${diffMonths} Monaten`;
}

/**
 * Formats a date in a warm, readable German format.
 * Example: "Freitag, 10. Januar"
 */
export function formatWarmDate(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  const weekdays = [
    'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 
    'Donnerstag', 'Freitag', 'Samstag'
  ];
  
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  
  const weekday = weekdays[targetDate.getDay()];
  const day = targetDate.getDate();
  const month = months[targetDate.getMonth()];
  
  return `${weekday}, ${day}. ${month}`;
}
