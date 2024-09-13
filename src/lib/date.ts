const stringToDate = (dateString: string): Date => {
  const regex = /^\d{2}-\d{2}-\d{4}$/;

  const [month, day, year] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return date;
};

const getStringFromDate = (date: Date, showYear?: boolean): string => {
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
  const year = date.getFullYear();
  return `${month} ${day} ${showYear ? year : ""}`;
};

export { stringToDate, getStringFromDate };
