export const environment = {
  production: false,
  azureAd: {
    clientId: '<<your clinet ID>>',
    tenantId: ' <<tenantId>>',
    redirectUri: 'http://localhost:4200',
    authority: 'https://login.microsoftonline.com/<<tenantId>>',
    scopes: ['user.read']
  }
};
