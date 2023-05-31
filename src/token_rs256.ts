require("dotenv").config();

import jwt, { SignOptions } from "jsonwebtoken";
import { getEnvVariable } from "./helpers";

export const signJwt = (
  payload: Object,
  keyName: "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_TOKEN_PRIVATE_KEY",
  options: SignOptions
) => {
  const privateKey = Buffer.from(getEnvVariable(keyName), "base64").toString(
    "ascii"
  );
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = <T>(
  token: string,
  keyName: "ACCESS_TOKEN_PUBLIC_KEY" | "REFRESH_TOKEN_PUBLIC_KEY"
): T | null => {
  try {
    const publicKey = Buffer.from(getEnvVariable(keyName), "base64").toString(
      "ascii"
    );
    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const user = {
  id: "3894stve8376gdhdj663h",
  name: "Admin",
  email: "admin@admin.com",
};

// Sign Access and Refresh tokens
const access_token = signJwt({ sub: user.id }, "ACCESS_TOKEN_PRIVATE_KEY", {
  expiresIn: `${getEnvVariable("ACCESS_TOKEN_EXPIRES_IN")}m`,
});

const refresh_token = signJwt({ sub: user.id }, "REFRESH_TOKEN_PRIVATE_KEY", {
  expiresIn: `${getEnvVariable("REFRESH_TOKEN_EXPIRES_IN")}m`,
});

console.log({ access_token, refresh_token });

// Verify Access and Refresh tokens
const access_token_payload = verifyJwt<{ sub: string }>(
  access_token,
  "ACCESS_TOKEN_PUBLIC_KEY"
);

if (access_token_payload) {
  console.log("✅Access token is valid");
} else {
  console.log("🔥Access token is invalid or has expired");
}

const refresh_token_payload = verifyJwt<{ sub: string }>(
  refresh_token,
  "REFRESH_TOKEN_PUBLIC_KEY"
);

if (refresh_token_payload) {
  console.log("✅Refresh token is valid");
} else {
  console.log("🔥Refresh token is invalid or has expired");
}
