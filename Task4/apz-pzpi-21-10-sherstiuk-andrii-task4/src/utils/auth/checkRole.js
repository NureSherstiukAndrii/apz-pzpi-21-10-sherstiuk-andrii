import { jwtDecode } from "jwt-decode";

const checkRole = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  const decoded = jwtDecode(token);
  // eslint-disable-next-line consistent-return
  return decoded.role;
};

export default checkRole;
