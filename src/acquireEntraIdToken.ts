import {
  PublicClientApplication,
  InteractionRequiredAuthError,
  type InteractiveRequest,
} from "@azure/msal-node";

import open from "open";
import { getAuthConfig } from "./authConfig";
import { createTokenCachePlugin } from "./createTokenCachePlugin";
import { logger } from "./logger";

const openBrowser = async (url: string) => {
  open(url);
};

const adoScope = "499b84ac-1321-427f-aa17-267ca6975798/.default";

interface Options {
  tenantId?: string;
  account?: string;
}

export async function acquireEntraIdToken(options?: Options) {
  options = options || {};

  const cachePlugin = await createTokenCachePlugin({ accountName: "ado-pat" });

  const pca = new PublicClientApplication({
    ...getAuthConfig({
      tenantId: options.tenantId,
    }),
    cache: { cachePlugin },
  });

  const accounts = await pca.getTokenCache().getAllAccounts();
  const loginRequest: InteractiveRequest = {
    scopes: [adoScope],
    openBrowser,
    successTemplate: "Successfully signed in! You can close this window now.",
  };

  if (accounts.length == 1) {
    const silentRequest = {
      account: accounts[0],
      scopes: [adoScope],
    };

    return pca.acquireTokenSilent(silentRequest).catch((e) => {
      if (e instanceof InteractionRequiredAuthError) {
        return pca.acquireTokenInteractive(loginRequest);
      }
    });
  } else if (accounts.length > 1) {
    if (!options.account) {
      accounts.forEach((account) => {
        logger.info(account.username);
      });
      return Promise.reject(
        "Multiple accounts found. Please select an account to use. Pass this in via '--account <account>' in the command line"
      );
    } else {
      const account = accounts.find((account) => account.username === options.account);
      if (!account) {
        return Promise.reject(`Account ${options.account} not found`);
      }

      const silentRequest = {
        account,
        scopes: [adoScope],
      };

      return pca.acquireTokenSilent(silentRequest).catch((e) => {
        if (e instanceof InteractionRequiredAuthError) {
          return pca.acquireTokenInteractive(loginRequest);
        }
      });
    }
  } else {
    return pca.acquireTokenInteractive(loginRequest);
  }
}
