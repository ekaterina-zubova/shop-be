const generatePolicy = (
  principalId: string,
  Resource: string,
  Effect: string
) => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect,
          Resource,
        },
      ],
    },
  };
};

const basicAuthorizer = async (event) => {
  console.log("Basic authorizer event: ", JSON.stringify(event));
  try {
    console.log("Basic authorizer event: ", JSON.stringify(event));

    if (event.type !== "TOKEN") {
      return "Unauthorized from lambda basicAuthorizer";
    }
    const authToken = event.authorizationToken;

    const [, encodedCreds] = authToken.split(" ");
    const buff = Buffer.from(encodedCreds, "base64");
    const [username, password] = buff.toString("utf-8").split(":");
    const validPassword = process.env[username];

    const effect = validPassword !== password ? "Deny" : "Allow";

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    console.log(`policy: ${JSON.stringify(policy)}`);

    return policy;
  } catch (e) {
    console.log("Basic authorizer error", e);
    throw Error("Unauthorized");
  }
};

export const main = basicAuthorizer;
