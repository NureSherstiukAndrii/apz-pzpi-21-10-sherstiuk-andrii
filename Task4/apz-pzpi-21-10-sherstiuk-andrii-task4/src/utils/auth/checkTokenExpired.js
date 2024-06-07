import { isAfter, fromUnixTime } from "date-fns";
import { jwtDecode } from "jwt-decode";

const checkTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  const decoded = jwtDecode(token);
  const currentDateTime = Date.now();
  const tokenExpirationDateTime = fromUnixTime(decoded.exp);
  const isExpired = isAfter(currentDateTime, tokenExpirationDateTime);
  if (isExpired) {
    localStorage.clear();
  }
};

export default checkTokenExpired;
