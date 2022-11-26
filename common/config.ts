export default {
  apiSettings: {
    origins: process.env.API_ALLOWED_CORS_ORIGINS!,
    apiCorsAllowedOrigins:
      process.env.API_ALLOWED_CORS_ORIGINS!.split(",") || "",
    domainName: process.env.API_DOMAIN_NAME!,
    hostedZoneName: process.env.HOSTED_ZONE_NAME!,
  },
  stage: {
    name: process.env.ENV!,
  },
  paths: {
    folder: process.env.PACKAGE_DIRECTORY!,
  },
  stackNames: {
    main: process.env.MAIN_STACK!,
  },
  stackValues: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
};
