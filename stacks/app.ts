#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import config from "../common/config";
import { ResourceStack } from "../stacks/ResourceStack";

const {
  stackNames: { main: mainStackName },
  stackValues: { account: acc, region: reg },
} = config;

const app = new cdk.App();
new ResourceStack(app, mainStackName, {
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { account: acc?.trim(), region: reg?.trim() },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
