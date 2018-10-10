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

'use strict';

const common = require('linkedge-common-js');
const util = require('./util');

const AUTH_TOKEN = common.envVars.AUTH_TOKEN;

class FCClient {
  constructor() {
    this.ipc = new common.IPCWrapper(AUTH_TOKEN);
  }

  invokeFunction(params, callback) {
    if (params.serviceName || params.functionName) {
      throw new Error('Invoking function via serviceName and functionName is not supported by now.');
    }
    var functionId = util.getRequiredParameter(params, 'functionId');
    if (functionId === undefined) {
      callback(new Error(`Can't find required parameter "functionId".`));
      return;
    }

    var invocationType;
    if (params.invocationType === undefined || params.invocationType === null) {
      invocationType = 'Sync';
    } else {
      invocationType = params.invocationType;
    }
    if (invocationType !== 'Sync' && invocationType !== 'Async') {
      callback(new Error(`Incorrect invocationType ${invocationType}. It should be "Sync" or "Async".`));
      return;
    }
    var invokerContext = params.invokerContext || '';
    var payload = params.payload;
    console.log(`Invoking local function "${functionId}" with payload "${payload}".`);
    this.ipc.postTask(functionId, invocationType, invokerContext, payload,
      (err, invocationId) => {
        if (err) {
          console.log(`Failed to invoke function due to ${err}`);
          callback(err);
          return;
        }
        if (invocationType === 'Async') {
          callback(null, invocationId);
          return;
        }
        this.ipc.getTaskResult(functionId, invocationId,
          (getTaskResultError, body, functionError, statusCode) => {
            if (getTaskResultError) {
              console.log(`Failed to get task result due to ${getTaskResultError}.`);
              callback(getTaskResultError);
              return;
            }
            const data = {
              functionError,
              statusCode,
              payload: body,
            };
            callback(null, data);
          });
      });
  }
}

module.exports = FCClient;
