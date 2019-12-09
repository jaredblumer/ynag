const config = {
 ynab: {
   "clientId": process.env.clientId,
   "redirectUri": process.env.redirectUri || "http://localhost:8080"
 }
};

module.exports = config;
