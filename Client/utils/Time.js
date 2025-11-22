 export const toIST = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
};
