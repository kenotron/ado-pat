import { acquireEntraIdToken } from "./acquireEntraIdToken";
import { Command } from "commander";

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
}

async function action({ tenantId, organization }: Options) {
  const tokenResponse = await acquireEntraIdToken({
    tenantId,
  });

  if (!tokenResponse) {
    console.error("Failed to acquire token");
    process.exit(1);
  }

  const patResponse = await fetch(
    `https://vssps.dev.azure.com/${organization}/_apis/tokens/pats?api-version=7.1-preview.1`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
      body: JSON.stringify({
        allOrgs: false,
        displayName: "ado-pat",
        scope: "vso.packaging_write",
        validTo: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
      }),
    }
  );

  if (patResponse.ok) {
    const pat = await patResponse.json();
    console.log(pat.token);
  } else {
    console.error("Failed to create PAT");
    console.error(await patResponse.text());
  }
}

main();
