import { type TokenCacheContext } from "@azure/msal-node";
import fs from "fs";

/**
 * Cache Plugin configuration
 */

export function cachePluginFactory() {
  const beforeCacheAccess = (cacheContext: TokenCacheContext) => {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(cacheLocation)) {
        fs.readFile(cacheLocation, "utf-8", (err, data) => {
          if (err) {
            reject(err);
          } else {
            cacheContext.tokenCache.deserialize(data);
            resolve();
          }
        });
      } else {
        fs.writeFile(
          cacheLocation,
          cacheContext.tokenCache.serialize(),
          (err) => {
            if (err) {
              reject(err);
            }
            resolve();
          }
        );
      }
    });
  };

  const afterCacheAccess = (cacheContext) => {
    return new Promise((resolve, reject) => {
      if (cacheContext.cacheHasChanged) {
        fs.writeFile(
          cacheLocation,
          cacheContext.tokenCache.serialize(),
          (err) => {
            if (err) {
              reject(err);
            }
            resolve();
          }
        );
      } else {
        resolve();
      }
    });
  };

  return {
    beforeCacheAccess,
    afterCacheAccess,
  };
}
