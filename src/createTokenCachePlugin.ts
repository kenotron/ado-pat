import {
  DataProtectionScope,
  Environment,
  PersistenceCreator,
  PersistenceCachePlugin,
} from "@azure/msal-node-extensions";

import os from "os";
import path from "path";

// See https://www.npmjs.com/package/@azure/msal-node-extensions#usage---cache-persistence
export async function createTokenCachePlugin({
  accountName,
}: {
  accountName: string;
}) {
  const homeDir = os.homedir();
  const cachePath = path.join(homeDir, ".ado-pat.json");

  const persistenceConfiguration = {
    cachePath,
    dataProtectionScope: DataProtectionScope.CurrentUser,
    serviceName: "ado-pat",
    accountName,
    usePlaintextFileOnLinux: false,
  };

  const persistence = await PersistenceCreator.createPersistence(
    persistenceConfiguration
  );

  return new PersistenceCachePlugin(persistence);
}
