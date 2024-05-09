interface GetPATOptions {
  organization: string;
  displayName: string;
  scope: string;
  validTo?: Date;
  entraIdToken: string;
}

export async function getPAT({
  organization,
  displayName,
  validTo,
  scope = "vso.packaging_write",
  entraIdToken,
}: GetPATOptions) {
  if (!validTo) {
    validTo = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);
  }

  const patResponse = await fetch(
    `https://vssps.dev.azure.com/${organization}/_apis/tokens/pats?api-version=7.1-preview.1`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${entraIdToken}`,
      },
      body: JSON.stringify({
        allOrgs: false,
        displayName,
        scope,
        validTo,
      }),
    }
  );

  if (patResponse.ok) {
    const pat = await patResponse.json();
    return pat;
  } else {
    throw new Error(await patResponse.text());
  }
}
