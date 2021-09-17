# hui-cdk-aws-project-typescript
This is AWS CDK project that using typescript language

Please remember run AWS Configure to use the AWS CDK Environment. 

https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html

🧰 Prerequisites

🛠 AWS CLI Installed & Configured - https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html

🛠 AWS CDK Installed & Configured - https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html


🚀 Deployment using AWS CDK

If you DONT have cdk installed
npm i -g aws-cdk
npm install -g typescript

If you get a permission error, and have administrator access on your system, try 
sudo npm install -g typescript.

If this is first time you are using cdk then, run cdk bootstrap
cdk bootstrap

You create a new AWS CDK project by invoking cdk init in an empty directory. Example:
mkdir hui-project
cd hui-project
cdk init app --language typescript

Managing AWS Construct Library modules
https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html

For example, the command below installs the modules for Amazon S3 and AWS Lambda.
npm install @aws-cdk/aws-s3 @aws-cdk/aws-lambda

Synthesize the template and deploy it
cdk synth cdk deploy 🧹 CleanUp If you want to destroy all the resources created by the stack, Execute the below command to delete the stack, or you can delete the stack from console as well

cdk destroy * This is not an exhaustive list, please carry out other necessary steps as maybe applicable to your needs.

!!!Please be mindful of all the resources this will occur the charges in your AWS Account!!!
