import { acquireEntraIdToken } from "./acquireEntraIdToken";
import { Command } from "commander";
import { getPAT } from "./getPAT";

async function main() {
  try {
    const program = new Command();
    program.option("-t, --tenant-id <tenant id>", "Azure AD tenant ID");
    program.option(
      "-d, --display-name <display name>",
      "Display name for the PAT"
    );

    program.option(
      "-o, --organization <org>",
      "Azure DevOps organization name"
    );

    program.action(action);

    await program.parseAsync(process.argv);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

interface Options {
  tenantId: string;
  organization: string;
  displayName: string;
}

async function action({ tenantId, organization, displayName }: Options) {
  const tokenResponse = await acquireEntraIdToken({
    tenantId,
  });

  if (!tokenResponse) {
    console.error("Failed to acquire token");
    process.exit(1);
  }

  console.log(
    await getPAT({
      organization,
      scope: "vso.packaging_write",
      displayName,
      entraIdToken: tokenResponse.accessToken,
    })
  );
}

main();
