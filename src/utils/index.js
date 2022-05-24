export const ellipsis = (string, start = 6, end = 4) => {
  return `${string.substring(0, start)}...${string.substring(
    string.length - end
  )}`;
};
