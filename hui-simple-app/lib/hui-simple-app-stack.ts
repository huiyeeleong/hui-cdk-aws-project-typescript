import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
import {Runtime} from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { PolicyStatement } from '@aws-cdk/aws-iam'
import {BucketDeployment, Source} from '@aws-cdk/aws-s3-deployment';
import {HttpApi,HttpMethod} from '@aws-cdk/aws-apigatewayv2'
import {LambdaProxyIntegration} from '@aws-cdk/aws-apigatewayv2-integrations'

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

    const bucketContainerPermissions = new PolicyStatement();
    bucketContainerPermissions.addResources(bucket.bucketArn);
    bucketContainerPermissions.addActions('s3:ListBucket');

    const bucketPermissions = new PolicyStatement();
    bucketPermissions.addResources(`${bucket.bucketArn}/*`);
    bucketPermissions.addActions('s3:GetObject', 's3:PutObject');

    getPhotos.addToRolePolicy(bucketPermissions);
    getPhotos.addToRolePolicy(bucketContainerPermissions);

    const httpApi = HttpApi(this,'MySimpleAppHttpApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods:[HttpMethod.GET]
      },
      apiName: 'photo-api',
      createDefaultStage: true
    })

    const lambdaIntegration = new LambdaProxyIntegration({
        handler: getPhotos
      });
    
    httpApi.addResources({
      path: '/getAllPhotos',
      methods: [
        HttpMethod.GET,
      ],
      integration: lambdaIntegration
    });
    

    //cloudformation ouput
    new cdk.CfnOutput(this,'HuiSimpleAppBucketNameExport',{
      value: bucket.bucketName,
      exportName: 'MySimpleAppBucketName',
    });

    new cdk.CfnOutput(this, 'MySimpleAppApi', {
      value: HttpApi.url,
      exportName: 'MySimpleAppApiEndPoint',
    });
  }
}
