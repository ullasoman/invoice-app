export const formatDate = (
  dateInput: string | Date,
  format: string = "m-d-Y"
): string => {
  if (!dateInput) return "";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput); // fallback if invalid

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  switch (format) {
    case "d-m-Y":
      return `${day}-${month}-${year}`;
    case "Y-m-d":
      return `${year}-${month}-${day}`;
    case "m-d-Y":
      return `${month}-${day}-${year}`;
    case "M d, Y":
      // Example: Oct 25, 2025
      return `${monthNames[date.getMonth()]} ${day}, ${year}`;
    default:
      return `${month}-${day}-${year}`;
  }
};
