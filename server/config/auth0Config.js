import { auth } from "express-oauth2-jwt-bearer";

const jwtCheck = auth({
  audience: "https://full-stack-real-estate-eight.vercel.app",
  issuerBaseURL: "https://dev-sbpud2ugulilvnq0.us.auth0.com",
  tokenSigningAlg: "RS256",
});

export default jwtCheck;
