import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Aws } from '@aws-cdk/core';

export class AwsCdkS3BucketStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create s3 bucket
    const bucket = new Bucket(this, 'HuiAppBucket',{
      encryption: BucketEncryption.S3_MANAGED
    });
    // Output the bucket name
    new cdk.CfnOutput(this, 'MySimpleAppBucketNameExport',{
      value: bucket.bucketName,
      exportName: 'HuiAppBucket'
    });
  }
}
