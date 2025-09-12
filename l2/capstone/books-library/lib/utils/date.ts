/**
 * Utility functions for date formatting
 */

/**
 * Formats a date to a long format (Month Day, Year)
 * @param date - Date string, Date object, or timestamp
 * @returns Long formatted date string
 */
export function formatDateLong(date: string | Date | number): string {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
