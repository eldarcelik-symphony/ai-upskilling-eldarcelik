const truncateText = (text: string, maxLength: number = 500) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export default truncateText;
