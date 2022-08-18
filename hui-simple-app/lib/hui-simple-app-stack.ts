import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
import {Runtime} from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { PolicyStatement } from '@aws-cdk/aws-iam'
import {BucketDeployment, Source} from '@aws-cdk/aws-s3-deployment';
import {HttpApi,HttpMethod} from '@aws-cdk/aws-apigatewayv2'
import {LambdaProxyIntegration} from '@aws-cdk/aws-apigatewayv2-integrations'
import {CloudFrontWebDistribution} from '@aws-cdk/aws-cloudfront'

interface SimpleAppStackProps extends cdk.StackProps{
  envName: String
}
export class HuiSimpleAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: SimpleAppStackProps) {
    super(scope, id, props);

    //create s3 bucket create encrpyted bucket when its dev else create unencrypted 
    const bucket = new Bucket(this, 'MySimpleAppBucket',{
      encryption: props?.envName === 'prod' ? BucketEncryption.S3_MANAGED: BucketEncryption.UNENCRYPTED
    });

    //copy local photo to s3 bucket
    new BucketDeployment(this, 'MySimpleAppPhoto',{
      sources:[Source.asset(path.join(__dirname, '..', 'photos'))],
      destinationBucket: bucket
    });

    const websiteBucket = new Bucket(this, 'MySimpleAppWebsiteBucket',{
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    

    //create cloudfront
    const cloudFront = new CloudFrontWebDistribution(this,'MySimpleAppDistribution',{
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket,
          },
          behaviours: [{isDefaultBehavior: true }],
        },
      ],
    });

    new BucketDeployment(this, 'MysimpleAppWebsiteDeploy', {
      sources: [Source.asset(path.join(__dirname,'..', 'frontend', 'build'))],
      destinationBucket: websiteBucket,
      distribution: cloudFront,
    });

    //create lambda function
    //this function require docker running
    const getPhotos = new lambda.NodejsFunction(this, 'MySimpleAppLamda',{
      runtime: Runtime.NODEJS_12_X,
      entry: path.join(__dirname, '..', 'api', 'get-photos', 'index.ts'),
      handler: 'getPhotos',
      environment:{
        PHOTO_BUCKET_NAME: bucket.bucketName,
      },
    });

    //Add bucket permission
    const bucketContainerPermissions = new PolicyStatement();
    bucketContainerPermissions.addResources(bucket.bucketArn);
    bucketContainerPermissions.addActions('s3:ListBucket');

    const bucketPermissions = new PolicyStatement();
    bucketPermissions.addResources(`${bucket.bucketArn}/*`);
    bucketPermissions.addActions('s3:GetObject', 's3:PutObject');

    getPhotos.addToRolePolicy(bucketPermissions);
    getPhotos.addToRolePolicy(bucketContainerPermissions);

    //Create api gateway
    const httpApi = HttpApi(this,'MySimpleAppHttpApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods:[HttpMethod.GET]
      },
      apiName: 'photo-api',
      createDefaultStage: true
    })

    //add lambda integration for api gateway
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
    new cdk.CfnOutput(this,'MySimpleAppBucketNameExport',{
      value: bucket.bucketName,
      exportName: 'MySimpleAppBucketName',
    });

    new cdk.CfnOutput(this,'MySimpleAppWebsiteBucketNameExport',{
      value: websiteBucket.bucketName,
      exportName: `MySimpleAppWebsiteBucketName${props?.envName}`,
    });

    new cdk.CfnOutput(this, 'MySimpleAppWebsiteUrl',{
      value: cloudFront.distributionDomainName,
      exportName: `MySimpleAppWebsiteUrl${props?.envName}`,
    });

    new cdk.CfnOutput(this, 'MySimpleAppApi', {
      value: HttpApi.url,
      exportName: `MySimpleAppApiEndPoint${props?.envName}`,
    });
  }
}
