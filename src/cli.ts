import { acquireEntraIdToken } from "./acquireEntraIdToken";
import { Command } from "commander";
import { getPAT } from "./getPAT";
import { logger } from "./logger";

async function main() {
  try {
    const program = new Command();
    program.option("-t, --tenant-id <tenant id>", "Azure AD tenant ID");
    program.option(
      "-d, --display-name <display name>",
      "Display name for the PAT",
      "ado-pat"
    );

    program.requiredOption(
      "-o, --organization <org>",
      "Azure DevOps organization name"
    );

    program.option(
      "-a, --account <account>",
      "Account to use for authentication, if multiple are found"
    );

    program.action(action);

    await program.parseAsync(process.argv);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}

interface Options {
  tenantId: string;
  organization: string;
  displayName: string;
  account: string;
}

async function action({
  tenantId,
  organization,
  displayName,
  account,
}: Options) {
  const tokenResponse = await acquireEntraIdToken({
    tenantId,
    ...(account && { account }),
  });

  if (!tokenResponse) {
    logger.error("Failed to acquire token");
    process.exit(1);
  }

  console.log(
    JSON.stringify(
      await getPAT({
        organization,
        scope: "vso.packaging_write",
        displayName,
        token: tokenResponse.accessToken,
      })
    )
  );
}

main();
