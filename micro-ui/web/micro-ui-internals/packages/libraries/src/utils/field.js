export const getFieldIdName = (fieldName = "", fieldId = "", screenPrefix = "") => {
    fieldName = fieldName ? fieldName : generateUniqueString(10);
    return fieldId
      ? fieldId
      : sanitizeToHtmlId(`${getScreenPrefix(screenPrefix)}-${filedName}`);
  };
  const getScreenPrefix = (prefix = "") => {
    const screenPaths = window.location.pathname.split("/");
    return prefix
      ? prefix
      : `${
          screenPaths?.[screenPaths?.length - 2] -
          screenPaths?.[screenPaths?.length - 1]
        }`;
  };
  const generateUniqueString = (length = 10) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  const sanitizeToHtmlId = (input) => {
    if (!input) return "id"; // Default to 'id' if input is empty or invalid
  
    // 1. Convert to lowercase
    // 2. Replace invalid characters (anything other than letters, numbers, hyphens, and underscores)
    // 3. Replace spaces or consecutive invalid characters with a single hyphen
    return input
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-") // Replace invalid characters with hyphens
      .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
  };
  