import { useState } from "react";

const usePassword = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return {
    togglePassword,
    isPasswordVisible,
  };
};

export default usePassword;
