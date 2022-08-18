import * as cdk from 'aws-cdk/core';
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import {BucketDeployment,Source } from '@aws-cdk/aws-s3-deployment'
import * as path from 'path'

interface S3BucketWithDeployProps{
    deployTo: string[]
    encrpytion: BucketEncryption
}
export class S3BucketWithDeploy extends cdk.construct{
    public readonly bucket: IBucket;
    constructor(scope: cdk.Construct, id: string, props?:S3BucketWithDeployProps){
        super(scope, id);
         //create s3 bucket create encrpyted bucket when its dev else create unencrypted 
        this.bucket = new Bucket(this, 'MySimpleAppBucket',{
            encryption: props.encrpytion,
        });
    
        //copy local photo to s3 bucket
        new BucketDeployment(this, 'MySimpleAppPhoto',{
            sources:[Source.asset(path.join(__dirname, ...props.deployTo))],
            destinationBucket: this.bucket
        });
    }
}
