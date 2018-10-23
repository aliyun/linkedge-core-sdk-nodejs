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
 * Demonstrates retrieving a group role credential if one is set and using it to write
 * binary data to OSS.
 */

'use strict';

var leSdk = require('linkedge-core-sdk');
var OSS = require('ali-oss');

var credChain= new leSdk.CredentialProviderChain();

exports.handler = function (event, context, callback) {
  // Retrieves group role credential.
  credChain.resolvePromise()
    .then((cred) => {
      console.log('Access Key Id: %s, Access Key Secret: %s, Security Token: %s',
        cred.accessKeyId, cred.accessKeySecret, cred.securityToken);

      // Constructs a client to interact with OSS cloud service.
      var client = new OSS({
        accessKeyId: cred.accessKeyId,
        accessKeySecret: cred.accessKeySecret,
        stsToken: cred.securityToken,
        region: '<Your OSS Region>',
        bucket: '<Your OSS Bucket>',
      });
      return client.put('Object-' + new Date(),
        new Buffer('Hello World! Sent from Link IoT Edge using Node.js.'));
    })
    .then((result) => {
      console.log(result);
      callback(null);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
};
