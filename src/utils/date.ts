export const formatDateToDDMMYYYY = (dateStr: string | undefined | null): string => {
  if (!dateStr) return "N/A";
  
  // Handle yyyy-mm-dd format from input type="date"
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatDateWithDayAndMonth = (dateStr: string | undefined | null): string => {
  if (!dateStr) return "N/A";
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = days[date.getDay()];

  return `${day}-${month}-${year} (${dayName})`;
};

export const formatTimeTo12H = (time24: string | undefined | null): string => {
  if (!time24) return "00:00 AM";
  
  // If already contains AM/PM, return as is
  if (time24.includes("AM") || time24.includes("PM")) return time24;

  const [hours, minutes] = time24.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return time24;

  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  const minutesStr = String(minutes).padStart(2, '0');

  return `${hours12}:${minutesStr} ${period}`;
};
