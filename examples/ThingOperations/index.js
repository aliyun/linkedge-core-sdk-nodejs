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
 * Demonstrates how to interact with things and get thing metadata according to tags.
 */

'use strict';

const leSdk = require('linkedge-core-sdk');

const iotData = new leSdk.IoTData();

const getPropertiesParams = {
  productKey: '<Product Key>',
  deviceName: '<Device Name>',
  payload: ['<Property>',]
};

const setPropertiesParams = {
  productKey: '<Product Key>',
  deviceName: '<Device Name>',
  payload: {'<Property>': '<Value>',}
};

const callServiceParams = {
  productKey: '<Product Key>',
  deviceName: '<Device Name>',
  service: '<Service Name>',
  payload: {'<Property>': '<Value>',},
};

const getThingsWithTagsParams = {
  payload: [{'<key>': '<value>'},],
};

// Promise wrapper for getThingProperties.
function getThingProperties(params) {
  return new Promise((resolve, reject) => {
    iotData.getThingProperties(params, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

// Promise wrapper for setThingProperties.
function setThingProperties(params) {
  return new Promise((resolve, reject) => {
    iotData.setThingProperties(params, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

// Promise wrapper for callThingService.
function callThingService(params) {
  return new Promise((resolve, reject) => {
    iotData.callThingService(params, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

// Promise wrapper for getThingsWithTags.
function getThingsWithTags(params) {
  return new Promise((resolve, reject) => {
    iotData.getThingsWithTags(params, (err, things) => {
      err ? reject(err) : resolve(things);
    });
  });
}

exports.handler = function (event, context, callback) {
  console.log(event.toString());
  console.log(context);

  getThingProperties(getPropertiesParams).then((data) => {
    console.log(data);
    return setThingProperties(setPropertiesParams);
  }).then((data) => {
    console.log(data);
    return callThingService(callServiceParams);
  }).then((data) => {
    console.log(data);
    return getThingsWithTags(getThingsWithTagsParams);
  }).then((things) => {
    console.log(JSON.stringify(things));
    callback(null);
  }).catch((err) => {
    console.log(err);
    callback(err);
  });
};