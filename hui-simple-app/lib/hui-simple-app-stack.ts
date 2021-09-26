import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
import {Runtime} from '@aws-cdk/aws-lambda';
import * as path from 'path';
import {BucketDeployment, Source} from '@aws-cdk/aws-s3-deployment';

export class HuiSimpleAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //create s3 bucket
    const bucket = new Bucket(this, 'HuiAppBucket',{
      encryption: BucketEncryption.S3_MANAGED
    });

    //copy local photo to s3 bucket
    new BucketDeployment(this, 'HuiSimpleAppPhoto',{
      sources:[Source.asset(path.join(__dirname, '..', 'photos'))],
      destinationBucket: bucket
    });

    //create lambda function
    //this function require docker running
    const getPhotos = new lambda.NodejsFunction(this, 'HuiSimpleAppLamda',{
      runtime: Runtime.NODEJS_12_X,
      entry: path.join(__dirname, '..', 'api', 'get-photos', 'index.ts'),
      handler: 'getPhotos',
      environment:{
        PHOTO_BUCKET_NAME: bucket.bucketName,
      },
    });

    //cloudformation ouput
    new cdk.CfnOutput(this,'HuiSimpleAppBucketNameExport',{
      value: bucket.bucketName,
      exportName: 'MySimpleAppBucketName',
    });
  }
}
