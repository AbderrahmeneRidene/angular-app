export const environment = {
  production: true,
  azureAd: {
    clientId: 'YOUR_PROD_CLIENT_ID',
    tenantId: 'YOUR_TENANT_ID',
    redirectUri: 'https://your-domain.com',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    scopes: ['user.read']
  }
};