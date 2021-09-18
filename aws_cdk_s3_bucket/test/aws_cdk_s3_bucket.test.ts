import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as AwsCdkS3Bucket from '../lib/aws_cdk_s3_bucket-stack';
import '@aws-cdk/assert'

test('Stack to create a s3 bucket', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new AwsCdkS3Bucket.AwsCdkS3BucketStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
