const stringToDate = (dateString: string): Date => {
  const regex = /^\d{2}-\d{2}-\d{4}$/;

  const [month, day, year] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

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
