/**
 * Formats a file size in bytes into a human-readable string (KB, MB, GB).
 * @param bytes - The file size in bytes.
 * @returns A formatted string like "1.23 MB".
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Formats a date string into a more readable format.
 * @param dateString - The date string to format.
 * @returns A formatted date like "Wednesday, July 2, 2025".
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Adding one day to the date to fix off-by-one issue from UTC conversion
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


/**
 * Formats a time string (HH:mm) into a 12-hour format with AM/PM.
 * @param timeString - The time string to format.
 * @returns A formatted time like "4:00 PM".
 */
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};