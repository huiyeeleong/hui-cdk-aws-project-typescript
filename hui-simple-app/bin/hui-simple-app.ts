#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HuiSimpleAppStack } from '../lib/hui-simple-app-stack';
import { HuiSimpleAppStackDNS } from '../lib/hui-simple-app-dns-stack';
import { eventNames } from 'process';


const domainNameApex = 'icarolavrodor.xyz'

const app = new cdk.App();

const {hostedZone, certificate} = new HuiSimpleAppStackDNS(app, 'HuiSimpleAppStackDNS', {
    dnsName: domainNameApex,
});

new HuiSimpleAppStack(app, 'HuiSimpleAppStack',{
    dnsName: domainNameApex, 
    hostedZone,
    certificate 
});


