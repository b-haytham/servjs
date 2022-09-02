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

// ------ log

export const log = {
  log(...args: any[]) {
    console.log(`[${new Date().toISOString()}] | LOG | ${args.join('')}`);
  },
  info(...args: any[]) {
    console.log(
      '\x1b[36m%s\x1b[0m',
      `[${new Date().toISOString()}] | INFO | ${args.join('')}`,
    );
  },
  warn(...args: any[]) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      `[${new Date().toISOString()}] | WARN | ${args.join('')}`,
    );
  },
  error(...args: any[]) {
    console.log(
      '\x1b[31m%s\x1b[0m',
      `[${new Date().toISOString()}] | ERROR | ${args.join('')}`,
    );
  },
  trace(...args: any[]) {
    console.log(`[${new Date().toISOString()}] | TRACE | ${args.join('')}`);
  },
};

// --------
