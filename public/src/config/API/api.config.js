import API_LOCAL from "./api-local";
// import API_LOCAL from "./api-local";
import API_PROD from "./api-prod";
import API_STAGE from "./api-stage";
import API_DEV from "./api-dev";
const hostname = window.location.hostname;

const port = window.location.port;
let isLocalApi = port >= 3000;

export const API =
  hostname === "localhost"
    ? API_DEV
    : hostname === "dev-app.barbera.io"
    ? API_DEV 
    : hostname === "app.barbera.io"
    ? API_PROD
    : hostname === "stage-app.barbera.io"
    ? API_STAGE
    : API_DEV;
