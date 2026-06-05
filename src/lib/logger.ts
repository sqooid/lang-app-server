import pino from "pino";

export const logger = pino(
  pino.transport({
    target: "pino-pretty",
    options: {
      colorize: true,
      sync: true,
      translateTime: "HH:MM:ss.l",
      ignore: "pid,hostname",
    },
  }),
);
