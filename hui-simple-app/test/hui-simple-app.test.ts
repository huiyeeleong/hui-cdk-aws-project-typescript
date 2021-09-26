import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as HuiSimpleApp from '../lib/hui-simple-app-stack';
import '@aws-cdk/assert'

test('Hui App Test Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new HuiSimpleApp.HuiSimpleAppStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
