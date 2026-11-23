type LogLevel = "debug" | "info" | "warn" | "error";

type LogFields = Record<string, unknown>;

function getErrorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return { errorType: typeof error };
  }

  return {
    errorName: error.name,
    errorMessage: error.message,
    ...(error.stack ? { errorStack: error.stack.slice(0, 4000) } : {})
  };
}

export function logServerEvent(level: LogLevel, event: string, fields: LogFields = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    vercelEnv: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    ...fields
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else if (level === "warn") {
    console.warn(JSON.stringify(entry));
  } else if (level === "info") {
    console.info(JSON.stringify(entry));
  } else {
    console.debug(JSON.stringify(entry));
  }
}

export function logError(event: string, error: unknown, fields: LogFields = {}) {
  logServerEvent("error", event, { ...fields, ...getErrorDetails(error) });
}
