import * as cdk from '@aws-cdk/core'
import {IPublicHostedZone, PublicHostedZone} from '@aws-cdk/aws-route53'
import { SlowBuffer } from 'buffer'
import { Certificate } from 'crypto';

interface HuiSimpleAppStackDNSProps extends cdk.StackProps{
    dnsName: string

}

export class HuiSimpleAppStackDNS extends cdk.Stack{
    public readonly hostedZone: IPublicHostedZone;
    public readonly certificate: ICertificate 


    constructor(scope: cdk.Construct, id: string, props: HuiSimpleAppStackDNSProps){
        super(scope, id, props)
        this.hostedZone = new PublicHostedZone(this, 'HuiSimpleAppHostedZone', {
            zoneName: props.dnsName,
        });

        this.certificate  = new Certificate(this, 'HuiSimpleAppCertificateManager', {
            domainName: props.dnsName,
            validation: CertificateValidation.fromDns(this.hostedZone);
        })
    }
}