import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as targets from "aws-cdk-lib/aws-route53-targets";

import { Construct } from "constructs";
import { resolve } from "path";
import config from "../common/config";

const {
  stackNames: { main: mainStackName },
  paths: { folder: packageDirectory },
  stage: { name: environment },
  apiSettings: {
    origins: allowedOrigins,
    domainName: apiDomainName,
    hostedZoneName: hostedZone,
  },
} = config;

export class ResourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const theHostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: hostedZone,
    });

    const theCertificate = new acm.Certificate(this, "Certificate", {
      domainName: apiDomainName,
      certificateName: "Service", // Optionally provide an certificate name
      validation: acm.CertificateValidation.fromDns(theHostedZone),
    });

    const api = new apigateway.RestApi(this, "api", {
      description: "example api gateway",
      deployOptions: {
        stageName: environment,
      },

      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: [allowedOrigins],
      },
      domainName: {
        domainName: apiDomainName,
        certificate: theCertificate,
      },
    });

    const healthLambda = new lambda.Function(this, "health-lambda", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "health.handler",
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(resolve(packageDirectory, "health.zip")),
    });

    const health = api.root.addResource("health");

    health.addMethod(
      "GET",
      new apigateway.LambdaIntegration(healthLambda, { proxy: true })
    );

    const logGroup = new logs.LogGroup(this, "ApiFunctionLogs", {
      logGroupName: `/aws/lambda/${healthLambda.functionName}`,
      retention: logs.RetentionDays.ONE_DAY,
    });

    // new apigateway.BasePathMapping(this, "BasePathMapping", {
    //   domainName: apiDomainName,
    //   restApi: api,
    // });

    new route53.ARecord(this, "DnsRecord", {
      recordName: apiDomainName,
      zone: theHostedZone,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api)),
    });

    new cdk.CfnOutput(this, "Log Group", {
      description: "The the lambda function",
      value: `${logGroup.logGroupName}`,
    });

    new cdk.CfnOutput(this, "Lambda Function", {
      description: "The the health lambda function",
      value: `${healthLambda.functionName}`,
    });

    new cdk.CfnOutput(this, "Stack Name", {
      description: "The main stack",
      value: mainStackName,
    });

    new cdk.CfnOutput(this, "Domain Name", {
      description: "The main stack",
      value: `https://${apiDomainName}`,
    });
  }
}
