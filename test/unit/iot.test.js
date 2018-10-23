/*
 * Copyright (c) 2018 Alibaba Group Holding Ltd. All rights reversed.
 */

const should = require('should');
const sinon = require('sinon');

const leSdk = require('linkedge-core-sdk');

const TEST_TOPIC = '/test/topic';
const TEST_PAYLOAD = 'TestPayload';

const TEST_PRODUCT_KEY = 'TestProductKey';
const TEST_DEVICE_NAME = 'TestDeviceName';

const TEST_GET_THING_PROPERTIES_PARAMS = [
  'Property1',
  'Property2'
];
const TEST_GET_THING_PROPERTIES_VALUES = [
  {'Property1': 'Value1'},
  {'Property2': 'Value2'}
];

const TEST_SET_THING_PROPERTIES_PARAMS = [
  {'Property1': 'Value1'},
  {'Property2': 'Value2'}
];
const TEST_SET_THING_PROPERTIES_VALUES = true;

const TEST_CALL_THING_SERVICE_NAME = 'TestServiceName';
const TEST_CALL_THING_SERVICE_PARAMS = 'TestServiceNameParams';
const TEST_CALL_THING_SERVICE_VALUES = 'Success';

const TEST_GET_THINGS_WITH_TAGS_PARAMS = [
  {'Tag1': 'Value1'},
  {'Tag2': 'Value2'}
];
const TEST_GET_THINGS_WITH_TAGS_VALUES = [
  { 'productKey': 'TestProductKey',
    'deviceName': 'TestDeviceName',
    'tags': [
      {'Tag1': 'Value1'},
      {'Tag2': 'Value2'}
    ],
  }
];


describe('IoTData', function () {
  var iotData;
  describe('#publish', function () {
    beforeEach(function () {
      iotData = new leSdk.IoTData();
    });
    afterEach(function () {
      iotData = null;
    });
    it('should fail since the required topic is undefined', function (done) {
      iotData.publish({
        topic: undefined,
        payload: TEST_PAYLOAD,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required topic is null', function (done) {
      iotData.publish({
        topic: null,
        payload: TEST_PAYLOAD,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required topic is empty', function (done) {
      iotData.publish({
        topic: '',
        payload: TEST_PAYLOAD,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required payload is undefined', function (done) {
      iotData.publish({
        topic: TEST_TOPIC,
        payload: undefined,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required payload is null', function (done) {
      iotData.publish({
        topic: TEST_TOPIC,
        payload: null,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required payload is empty', function (done) {
      iotData.publish({
        topic: TEST_TOPIC,
        payload: '',
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since connection error', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(new Error(`Connection has broken.`));
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.publish({
        topic: TEST_TOPIC,
        payload: TEST_PAYLOAD,
      }, (err) => {
        should.exist(err);
        end();
      });
    });
    it('should pass since all requirements meet', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, Math.random().toString(36).substr(2));
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.publish({
        topic: TEST_TOPIC,
        payload: TEST_PAYLOAD,
      }, (err) => {
        should.not.exist(err);
        end();
      });
    });
  });
  describe('#getThingProperties', function () {
    beforeEach(function () {
      iotData = new leSdk.IoTData();
    });
    afterEach(function () {
      iotData = null;
    });
    it('should fail since the required product key is undefined', function (done) {
      iotData.getThingProperties({
        productKey: undefined,
        deviceName: TEST_DEVICE_NAME,
        payload: TEST_GET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required product key is null', function (done) {
      iotData.getThingProperties({
        productKey: null,
        deviceName: TEST_DEVICE_NAME,
        payload: TEST_GET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required device name is undefined', function (done) {
      iotData.getThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: undefined,
        payload: TEST_GET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required device name is null', function (done) {
      iotData.getThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: null,
        payload: TEST_GET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required payload is undefined', function (done) {
      iotData.getThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        payload: undefined,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required payload is null', function (done) {
      iotData.getThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        payload: null,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required payload is empty', function (done) {
      iotData.getThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        payload: '',
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since connection error', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(new Error(`Connection has broken.`));
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.getThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        payload: TEST_GET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.exist(err);
        end();
      });
    });
    it('should fail since unhandled function error', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          functionError: 'Unhandled',
          statusCode: 200,
          payload: 'Internal error!'
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.getThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        payload: TEST_GET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.exist(err);
        end();
      });
    });
    it('should pass since all requirements meet', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          statusCode: 200,
          payload: JSON.stringify(TEST_GET_THING_PROPERTIES_VALUES),
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.getThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        payload: TEST_GET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.not.exist(err);
        end();
      });
    });
  });

  describe('#setThingProperties', function () {
    beforeEach(function () {
      iotData = new leSdk.IoTData();
    });
    afterEach(function () {
      iotData = null;
    });
    it('should fail since the required product key is undefined', function (done) {
      iotData.setThingProperties({
        productKey: undefined,
        deviceName: TEST_DEVICE_NAME,
        payload: TEST_SET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required product key is null', function (done) {
      iotData.setThingProperties({
        productKey: null,
        deviceName: TEST_DEVICE_NAME,
        payload: TEST_SET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required device name is undefined', function (done) {
      iotData.setThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: undefined,
        payload: TEST_SET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required device name is null', function (done) {
      iotData.setThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: null,
        payload: TEST_SET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required payload is undefined', function (done) {
      iotData.setThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        payload: undefined,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required payload is null', function (done) {
      iotData.setThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        payload: null,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required payload is empty', function (done) {
      iotData.setThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        payload: '',
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since connection error', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(new Error(`Connection has broken.`));
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.setThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        payload: TEST_SET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.exist(err);
        end();
      });
    });
    it('should fail since unhandled function error', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          functionError: 'Unhandled',
          statusCode: 200,
          payload: 'Internal error!'
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.setThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        payload: TEST_SET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.exist(err);
        end();
      });
    });
    it('should pass since all requirements meet', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          statusCode: 200,
          payload: JSON.stringify(TEST_SET_THING_PROPERTIES_VALUES),
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.setThingProperties({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        payload: TEST_SET_THING_PROPERTIES_PARAMS,
      }, (err) => {
        should.not.exist(err);
        end();
      });
    });
  });
  describe('#callThingService', function () {
    beforeEach(function () {
      iotData = new leSdk.IoTData();
    });
    afterEach(function () {
      iotData = null;
    });
    it('should fail since the required product key is undefined', function (done) {
      iotData.callThingService({
        productKey: undefined,
        deviceName: TEST_DEVICE_NAME,
        service: TEST_CALL_THING_SERVICE_NAME,
        payload: TEST_CALL_THING_SERVICE_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required product key is null', function (done) {
      iotData.callThingService({
        productKey: null,
        deviceName: TEST_DEVICE_NAME,
        service: TEST_CALL_THING_SERVICE_NAME,
        payload: TEST_CALL_THING_SERVICE_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required device name is undefined', function (done) {
      iotData.callThingService({
        productKey: TEST_PRODUCT_KEY,
        deviceName: undefined,
        service: TEST_CALL_THING_SERVICE_NAME,
        payload: TEST_CALL_THING_SERVICE_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required device name is null', function (done) {
      iotData.callThingService({
        productKey: TEST_PRODUCT_KEY,
        deviceName: null,
        service: TEST_CALL_THING_SERVICE_NAME,
        payload: TEST_CALL_THING_SERVICE_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required service name is undefined', function (done) {
      iotData.callThingService({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        service: undefined,
        payload: TEST_CALL_THING_SERVICE_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required device name is null', function (done) {
      iotData.callThingService({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        service: null,
        payload: TEST_CALL_THING_SERVICE_PARAMS,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since connection error', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(new Error(`Connection has broken.`));
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.callThingService({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        service: TEST_CALL_THING_SERVICE_NAME,
        payload: TEST_CALL_THING_SERVICE_PARAMS,
      }, (err) => {
        should.exist(err);
        end();
      });
    });
    it('should fail since unhandled function error', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          functionError: 'Unhandled',
          statusCode: 200,
          payload: 'Internal error!'
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.callThingService({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        service: TEST_CALL_THING_SERVICE_NAME,
        payload: TEST_CALL_THING_SERVICE_PARAMS,
      }, (err) => {
        should.exist(err);
        end();
      });
    });
    it('should fail since the payload is invalid', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          functionError: 'Handled',
          statusCode: 200,
          payload: 'The payload is invalid!'
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.callThingService({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        service: TEST_CALL_THING_SERVICE_NAME,
        payload: TEST_CALL_THING_SERVICE_PARAMS,
      }, (err) => {
        should.exist(err);
        end();
      });
    });
    it('should pass since all requirements meet', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          statusCode: 200,
          payload: JSON.stringify(TEST_CALL_THING_SERVICE_VALUES),
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.callThingService({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        service: TEST_CALL_THING_SERVICE_NAME,
        payload: TEST_CALL_THING_SERVICE_PARAMS,
      }, (err) => {
        should.not.exist(err);
        end();
      });
    });
    it('should pass with undefined payload', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          statusCode: 200,
          payload: JSON.stringify(TEST_CALL_THING_SERVICE_VALUES),
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.callThingService({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        service: TEST_CALL_THING_SERVICE_NAME,
        payload: undefined,
      }, (err) => {
        should.not.exist(err);
        end();
      });
    });
    it('should pass with null payload', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          statusCode: 200,
          payload: JSON.stringify(TEST_CALL_THING_SERVICE_VALUES),
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.callThingService({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        service: TEST_CALL_THING_SERVICE_NAME,
        payload: null,
      }, (err) => {
        should.not.exist(err);
        end();
      });
    });
    it('should pass with empty payload', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          statusCode: 200,
          payload: JSON.stringify(TEST_CALL_THING_SERVICE_VALUES),
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.callThingService({
        productKey: TEST_PRODUCT_KEY,
        deviceName: TEST_DEVICE_NAME,
        service: TEST_CALL_THING_SERVICE_NAME,
        payload: '',
      }, (err) => {
        should.not.exist(err);
        end();
      });
    });
  });
  describe('#getThingWithTags', function () {
    beforeEach(function () {
      iotData = new leSdk.IoTData();
    });
    afterEach(function () {
      iotData = null;
    });
    it('should fail since the required payload is undefined', function (done) {
      iotData.getThingsWithTags({
        payload: undefined,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required payload is null', function (done) {
      iotData.getThingsWithTags({
        payload: null,
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required payload is empty', function (done) {
      iotData.getThingsWithTags({
        payload: '',
      }, (err) => {
        should.exist(err);
        done();
      });
    });
    it('should fail since connection error', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(new Error(`Connection has broken.`));
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.getThingsWithTags({
        payload: TEST_GET_THINGS_WITH_TAGS_PARAMS,
      }, (err) => {
        should.exist(err);
        end();
      });
    });
    it('should fail since unhandled function error', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          functionError: 'Unhandled',
          statusCode: 200,
          payload: 'Internal error!'
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.getThingsWithTags({
        payload: TEST_GET_THINGS_WITH_TAGS_PARAMS,
      }, (err) => {
        should.exist(err);
        end();
      });
    });
    it('should fail since the payload is invalid', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          functionError: 'Handled',
          statusCode: 200,
          payload: 'The payload is invalid!'
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.callThingService({
        payload: TEST_GET_THINGS_WITH_TAGS_PARAMS,
      }, (err) => {
        should.exist(err);
        end();
      });
    });
    it('should pass since all requirements meet', function (done) {
      var stub = sinon.stub(iotData.fc, 'invokeFunction').callsFake(function (option, callback) {
        callback(null, {
          statusCode: 200,
          payload: JSON.stringify(TEST_GET_THINGS_WITH_TAGS_VALUES),
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      iotData.getThingsWithTags({
        payload: TEST_GET_THINGS_WITH_TAGS_PARAMS,
      }, (err) => {
        should.not.exist(err);
        end();
      });
    });
  });
});