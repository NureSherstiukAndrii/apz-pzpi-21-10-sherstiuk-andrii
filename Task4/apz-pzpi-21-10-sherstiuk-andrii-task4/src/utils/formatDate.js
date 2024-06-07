import { format } from "date-fns";

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  return format(date, "dd-MM-yyyy");
};

export default formatDate;
