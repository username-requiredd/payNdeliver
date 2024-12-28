import Tokens from "csrf";

const tokens = new Tokens();

export const generateToken = async (secret) => {
  return tokens.create(secret);
};

export const verifyToken = async (secret, token) => {
  return tokens.verify(secret, token);
};
