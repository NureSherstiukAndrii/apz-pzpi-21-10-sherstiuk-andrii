const formatDateAndTime = (inputDate) => {
  const originalDate = new Date(inputDate);
  const utcDate = new Date(originalDate.getTime() + originalDate.getTimezoneOffset() * 60000);
  return `${utcDate.toLocaleTimeString()}, ${utcDate.toLocaleDateString()}`;
};

export default formatDateAndTime;
