const generateUniqueFileName = (originalFileName) => {
  const uniqueIdentifier = Date.now(); // You can use a more sophisticated method for generating unique identifiers
  const extension = originalFileName.split(".").pop(); // Extract the file extension
  return `${uniqueIdentifier}.${extension}`;
};

export default generateUniqueFileName;
