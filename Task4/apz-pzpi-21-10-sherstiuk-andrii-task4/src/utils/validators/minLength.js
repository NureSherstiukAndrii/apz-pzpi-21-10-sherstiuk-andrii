const minLength = (value) => (value.length > 8 ? undefined : "Length must be more then 8");

export default minLength;
