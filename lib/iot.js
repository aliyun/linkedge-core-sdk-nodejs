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
const FCClient = require('./fc');
const util = require('./util');

const envVars = common.envVars;
const MY_FUNCTION_ID = envVars.MY_FUNCTION_ID;
const THING_FUNCTION_ID = envVars.THING_FUNCTION_ID;
const ROUTER_FUNCTION_ID = envVars.ROUTER_FUNCTION_ID;

class IoTData {
  constructor() {
    this.fc = new FCClient();
  }

  publish(params, callback) {
    var topic = util.getRequiredParameter(params, 'topic');
    if (topic === undefined) {
      callback(new Error(`Can't find required parameter "topic".`));
      return;
    }
    var payload = util.getRequiredParameter(params, 'payload');
    if (payload === undefined) {
      callback(new Error(`Can't find required parameter "payload".`));
      return;
    }
    var context = {
      custom: {
        source: MY_FUNCTION_ID,
        topic: topic,
      }
    };
    var invokerContext = Buffer.from(JSON.stringify(context)).toString('base64');
    var invokeParams = {
      functionId: ROUTER_FUNCTION_ID,
      invocationType: 'Async',
      invokerContext,
      payload,
    };
    console.log(`Publishing message on topic "${topic}" with payload "${payload}".`);
    this.fc.invokeFunction(invokeParams, (err, data) => {
      err ? callback(err) : callback(null, data);
    });
  }

  getThingProperties(params, callback) {
    var payload = util.getRequiredParameter(params, 'payload');
    if (payload === undefined) {
      callback(new Error(`Can't find required parameter "payload".`));
      return;
    }
    var parameters = {
      productKey: params.productKey,
      deviceName: params.deviceName,
      service: 'get',
      payload: params.payload,
    };
    this.callThingService(parameters, callback);
  }

  setThingProperties(params, callback) {
    var payload = util.getRequiredParameter(params, 'payload');
    if (payload === undefined) {
      callback(new Error(`Can't find required parameter "payload".`));
      return;
    }
    var parameters = {
      productKey: params.productKey,
      deviceName: params.deviceName,
      service: 'set',
      payload: params.payload,
    };
    this.callThingService(parameters, callback);
  }

  callThingService(params, callback) {
    var productKey = util.getRequiredParameter(params, 'productKey');
    if (productKey === undefined) {
      callback(new Error(`Can't find required parameter "productKey".`));
      return;
    }
    var deviceName = util.getRequiredParameter(params, 'deviceName');
    if (deviceName === undefined) {
      callback(new Error(`Can't find required parameter "deviceName".`));
      return;
    }
    var service = util.getRequiredParameter(params, 'service');
    if (service === undefined) {
      callback(new Error(`Can't find required parameter "service".`));
      return;
    }
    var payload = JSON.stringify(params.payload);
    console.log(`Calling service "${service}" with payload "${payload}" on thing "${deviceName}".`);

    var topic = `/sys/things/${productKey}/${deviceName}/services/${service}`;
    var context = {
      custom: {
        topic: topic,
      }
    };
    var invokerContext = Buffer.from(JSON.stringify(context)).toString('base64');
    var invokeParams = {
      functionId: THING_FUNCTION_ID,
      invokerContext,
      payload,
    };
    this.fc.invokeFunction(invokeParams, (err, data) => {
      if (err) {
        callback(err);
      } else {
        if (data.functionError) {
          callback(new Error(data.payload.toString()));
        } else {
          callback(null, JSON.parse(data.payload.toString()));
        }
      }
    });
  }

  getThingsWithTags(params, callback) {
    var payload = util.getRequiredParameter(params, 'payload');
    if (payload === undefined) {
      callback(new Error(`Can't find required parameter "payload".`));
      return;
    }
    payload = JSON.stringify(payload);
    console.log(`Obtaining thing infos with payload ${payload}.`);

    var topic = `/sys/things///services/getthingswithtags`;
    var context = {
      custom: {
        topic: topic,
      }
    };
    var invokerContext = Buffer.from(JSON.stringify(context)).toString('base64');
    var invokeParams = {
      functionId: THING_FUNCTION_ID,
      invokerContext,
      payload,
    };
    this.fc.invokeFunction(invokeParams, (err, data) => {
      if (err) {
        callback(err);
      } else {
        if (data.functionError) {
          callback(new Error(data.payload.toString()));
        } else {
          callback(null, JSON.parse(data.payload.toString()));
        }
      }
    });
  }
}

module.exports = IoTData;