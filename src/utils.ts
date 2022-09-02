export const parseQuery = (str: string | null): Record<string, any> => {
  if (!str) return {};

  const querySearchParams = new URLSearchParams(str);

  const queryEntries = Array.from(querySearchParams.entries());

  if (queryEntries.length == 0) {
    return {};
  }

  const obj: Record<string, any> = {};
  for (const entry of querySearchParams.entries()) {
    obj[entry[0]] = entry[1];
  }
  return obj;
};
