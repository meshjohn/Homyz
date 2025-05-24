import { auth } from "express-oauth2-jwt-bearer";

const jwtCheck = auth({
    audience: "http://localhost:8000",
    issuerBaseURL: "https://dev-cjthkvbi2d02zo4n.us.auth0.com",
    tokenSigningAlg: "RS256"
});

export default jwtCheck;