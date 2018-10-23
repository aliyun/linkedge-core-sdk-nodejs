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
 * Demonstrates publishing messages to a topic using Link IoT Edge Core SDK. The function sends
 * a hello world message to the topic '/hello/world' every 5 seconds As the function is
 * long-lived it will run immediately and forever when deployed to a Link IoT Edge.
 */

'use strict';

const leSdk = require('linkedge-core-sdk');

const iotData = new leSdk.IoTData();

function publishCallback(err, data) {
  console.log(err);
  console.log(data);
}

function publishHelloWorld() {
  const message = {
    topic: '/hello/world',
    payload: 'Hello World! Sent from Link IoT Edge using Node.js.',
  };
  iotData.publish(message, publishCallback);
}

// Schedule to publish hello world messages every 5 seconds.
setInterval(publishHelloWorld, 5000);

// The function is long-lived and the handler does nothing.
exports.handler = function (event, context, callback) {
  console.log(event);
  console.log(context);
  callback(null);
};
