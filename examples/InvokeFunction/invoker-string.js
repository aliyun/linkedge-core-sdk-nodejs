/*
 * Copyright (c) 2018 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Demonstrates how to invoke another function with string data, and receive the result.
 */

'use strict';

const leSdk = require('linkedge-core-sdk');

const fc = new leSdk.FCClient();

exports.handler = function (event, context, callback) {
  console.log(event);
  console.log(context);

  var ctx = {
    custom: {
      data: 'Custom data from Invoker',
    },
  };
  var invokerContext = Buffer.from(JSON.stringify(ctx)).toString('base64');
  var invokeParams = {
    functionId: '<Invokee Function Id>',
    invocationType: 'Sync',
    invokerContext: invokerContext,
    payload: 'String message from Invoker.',
  };
  fc.invokeFunction(invokeParams, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
    callback(null);
  });
};