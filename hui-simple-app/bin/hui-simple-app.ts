#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HuiSimpleAppStack } from '../lib/hui-simple-app-stack';
import { eventNames } from 'process';


const app = new cdk.App();
new HuiSimpleAppStack(app, 'HuiSimpleAppStack-dev', {
  env: {region: "us-east-2"},
  envName: 'dev'
});
new HuiSimpleAppStack(app, 'HuiSimpleAppStack-prod', {
  env: {region: "us-east-1"},
  envName: 'prod'
});