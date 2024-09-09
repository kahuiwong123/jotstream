const stringToDate = (dateString: string): Date | null => {
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  if (!regex.test(dateString)) {
    return null;
  }

  const [month, day, year] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

const getMonthDayFromDate = (date: Date): string => {
  const monthNames = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];

  const month = monthNames[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}`;
};

export { stringToDate, getMonthDayFromDate };
