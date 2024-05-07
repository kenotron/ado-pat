import { type TokenCacheContext } from "@azure/msal-node";
import { Entry } from "@napi-rs/keyring";
import os from "os";

/**
 * Cache Plugin configuration
 */

export function cachePluginFactory(tenantId: string) {
  const user = os.userInfo().username;
  const key = `ado-pat:${tenantId}`;
  const entry = new Entry(key, user);

  const beforeCacheAccess = (cacheContext: TokenCacheContext) => {
    return new Promise<void>((resolve, reject) => {
      const token = entry.getPassword();
      if (token) {
        cacheContext.tokenCache.deserialize(token);
      } else {
        entry.setPassword(cacheContext.tokenCache.serialize());
      }

      resolve();
    });
  };

  const afterCacheAccess = (cacheContext: TokenCacheContext) => {
    return new Promise<void>((resolve, reject) => {
      if (cacheContext.cacheHasChanged) {
        entry.setPassword(cacheContext.tokenCache.serialize());
      }

      resolve();
    });
  };

  return {
    beforeCacheAccess,
    afterCacheAccess,
  };
}
