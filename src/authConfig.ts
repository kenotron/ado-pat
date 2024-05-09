import { type Configuration, LogLevel } from "@azure/msal-node";
import { logger } from "./logger";

const DEFAULT_CLIENT_ID = "04f0c124-f2bc-4f59-8241-bf6df9866bbd";

interface AuthConfigOptions {
  clientId?: string;
  tenantId: string;
}

export function getAuthConfig({
  clientId,
  tenantId,
}: AuthConfigOptions): Configuration {
  clientId = clientId || DEFAULT_CLIENT_ID;
  tenantId = tenantId || "common";

  const url = new URL(`https://login.microsoftonline.com/${tenantId}`);

  return {
    auth: {
      clientId,
      authority: url.toString(),
    },
    system: {
      loggerOptions: {
        loggerCallback(loglevel, message, _containsPii) {
          switch (loglevel) {
            case LogLevel.Error:
              logger.error(message);
              break;
            case LogLevel.Warning:
              logger.warn(message);
              break;
            case LogLevel.Info:
              logger.info(message);
              break;
            case LogLevel.Verbose:
              logger.debug(message);
              break;
            default:
              logger.info(message);
              break;
          }
        },
        piiLoggingEnabled: false,
        logLevel: LogLevel.Info,
      },
    },
  };
}
