/*
 * Copyright (c) 2018 Alibaba Group Holding Ltd. All rights reversed.
 */

'use strict';

const should = require('should');
const sinon = require('sinon');

const buildArnString = require('linkedge-common-js').buildArnString;
const leSdk = require('linkedge-core-sdk');

const TEST_FUNCTION_ID = 'TestFunctionId';
const TEST_FUNCTION_NAME = 'TestFunctionName';
const TEST_SERVICE_NAME = 'TestServiceName';
const TEST_PAYLOAD = 'TestPayload';

describe('FCClient', function () {
  var fcClient;
  beforeEach(function () {
    fcClient = new leSdk.FCClient();
  });
  describe('#invokeFunction', function () {
    it('should fail since the required serviceName is undefined', function (done) {
      fcClient.invokeFunction({
        serviceName: undefined,
        functionName: TEST_FUNCTION_NAME,
      }, function (err) {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required serviceName is null', function (done) {
      fcClient.invokeFunction({
        serviceName: null,
        functionName: TEST_FUNCTION_NAME,
      }, function (err) {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required functionName is undefined', function (done) {
      fcClient.invokeFunction({
        functionName: undefined,
        serviceName: TEST_SERVICE_NAME,
      }, function (err) {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required functionName is null', function (done) {
      fcClient.invokeFunction({
        functionName: null,
        serviceName: TEST_SERVICE_NAME,
      }, function (err) {
        should.exist(err);
        done();
      });
    });
    it('should fail since the specified function name does not exist', function (done) {
      var functionName = TEST_FUNCTION_NAME;
      var serviceName = TEST_SERVICE_NAME;
      var functionArn = buildArnString('', '', serviceName, functionName);
      var stub = sinon.stub(fcClient.ipc, 'postTask').callsFake(
        function (functionId, invocationType, invokerContext, payload, callback) {
          if (functionId === functionArn) {
            callback(new Error(`Function ${functionId} does not exist.`));
          }
      });
      fcClient.invokeFunction({
        serviceName,
        functionName,
        invocationType: 'Sync',
      }, function (err) {
        should.exist(err);
        stub.restore();
        done();
      });
    });
    it('should fail since the specified service name does not exist', function (done) {
      var functionName = TEST_FUNCTION_NAME;
      var serviceName = TEST_SERVICE_NAME;
      var functionArn = buildArnString('', '', serviceName, functionName);
      var stub = sinon.stub(fcClient.ipc, 'postTask').callsFake(
        function (functionId, invocationType, invokerContext, payload, callback) {
          if (functionId === functionArn) {
            callback(new Error(`Function ${functionId} does not exist.`));
          }
        });
      fcClient.invokeFunction({
        serviceName,
        functionName,
        invocationType: 'Sync',
      }, function (err) {
        should.exist(err);
        stub.restore();
        done();
      });
    });
    it('should fail since the required functionId is undefined', function (done) {
      fcClient.invokeFunction({
        functionId: undefined,
      }, function (err) {
        should.exist(err);
        done();
      });
    });
    it('should fail since the required functionId is null', function (done) {
      fcClient.invokeFunction({
        functionId: null,
      }, function (err) {
        should.exist(err);
        done();
      });
    });
    it('should fail since the specified functionId does not exist', function (done) {
      var stub = sinon.stub(fcClient.ipc, 'postTask').callsFake(
        function (functionId, invocationType, invokerContext, payload, callback) {
          if (functionId === TEST_FUNCTION_ID) {
            callback(new Error(`Function ${functionId} does not exist.`));
          }
        });
      fcClient.invokeFunction({
        functionId: TEST_FUNCTION_ID,
        invocationType: 'Sync',
      }, function (err) {
        should.exist(err);
        stub.restore();
        done();
      });
    });
    it('should fail since the required invocationType is not Sync or Async', function (done) {
      fcClient.invokeFunction({
        serviceName: TEST_SERVICE_NAME,
        functionName: TEST_FUNCTION_NAME,
        invocationType: 'DryRun',
      }, function (err) {
        should.exist(err);
        done();
      });
    });
    it('should fail since connection error raises', function (done) {
      var postTaskStub = sinon.stub(fcClient.ipc, 'postTask').callsFake(
        function (functionId, invocationType, invokerContext, payload, callback) {
          callback(null, Math.random().toString(36).substr(2));
        });
      var getTaskResultStub = sinon.stub(fcClient.ipc, 'getTaskResult').callsFake(
        function (functionId, invocationId, callback) {
          callback(new Error(`Connection is closed`));
        });
      fcClient.invokeFunction({
        serviceName: TEST_SERVICE_NAME,
        functionName: TEST_FUNCTION_NAME,
      }, function (err) {
        should.exist(err);
        postTaskStub.restore();
        getTaskResultStub.restore();
        done();
      });
    });
    it('should pass since all requirements meet', function (done) {
      var stub = sinon.stub(fcClient.ipc, 'postTask').callsFake(
        function (functionId, invocationType, invokerContext, payload, callback) {
          callback(null, Math.random().toString(36).substr(2));
      });
      fcClient.invokeFunction({
        serviceName: TEST_SERVICE_NAME,
        functionName: TEST_FUNCTION_NAME,
        invocationType: 'Async',
      }, function (err) {
        should.not.exist(err);
        stub.restore();
        done();
      });
    });
    it('should pass with correct function id', function (done) {
      var stub = sinon.stub(fcClient.ipc, 'postTask').callsFake(
        function (functionId, invocationType, invokerContext, payload, callback) {
          if (functionId === TEST_FUNCTION_ID) {
            callback(null, Math.random().toString(36).substr(2));
          } else {
            callback(new Error(`Function "${functionId}" does not exist.`));
          }
        });
      fcClient.invokeFunction({
        functionId: TEST_FUNCTION_ID,
        invocationType: 'Async',
      }, function (err) {
        should.not.exist(err);
        stub.restore();
        done();
      });
    });
    it('should pass with undefined InvocationType', function (done) {
      var postTaskStub = sinon.stub(fcClient.ipc, 'postTask').callsFake(
        function (functionId, invocationType, invokerContext, payload, callback) {
          callback(null, Math.random().toString(36).substr(2));
        });
      var getTaskResultStub = sinon.stub(fcClient.ipc, 'getTaskResult').callsFake(
        function (functionId, invocationId, callback) {
          callback(null, 'Success', null, 200);
        });
      fcClient.invokeFunction({
        serviceName: TEST_SERVICE_NAME,
        functionName: TEST_FUNCTION_NAME,
        invocationType: undefined,
      }, function (err) {
        should.not.exist(err);
        postTaskStub.restore();
        getTaskResultStub.restore();
        done();
      });
    });
    it('should pass with null InvocationType', function (done) {
      var postTaskStub = sinon.stub(fcClient.ipc, 'postTask').callsFake(
        function (functionId, invocationType, invokerContext, payload, callback) {
          callback(null, Math.random().toString(36).substr(2));
        });
      var getTaskResultStub = sinon.stub(fcClient.ipc, 'getTaskResult').callsFake(
        function (functionId, invocationId, callback) {
          callback(null, 'Success', null, 200);
        });
      fcClient.invokeFunction({
        serviceName: TEST_SERVICE_NAME,
        functionName: TEST_FUNCTION_NAME,
        invocationType: null,
      }, function (err) {
        should.not.exist(err);
        postTaskStub.restore();
        getTaskResultStub.restore();
        done();
      });
    });
    it('should pass with valid payload', function (done) {
      var stub = sinon.stub(fcClient.ipc, 'postTask').callsFake(
        function (functionId, invocationType, invokerContext, payload, callback) {
          if (payload === TEST_PAYLOAD) {
            callback(null, Math.random().toString(36).substr(2));
          } else {
            callback(new Error(`Payload is invalid.`));
          }
        });
      fcClient.invokeFunction({
        serviceName: TEST_SERVICE_NAME,
        functionName: TEST_FUNCTION_NAME,
        invocationType: 'Async',
        payload: TEST_PAYLOAD,
      }, function (err) {
        should.not.exist(err);
        stub.restore();
        done();
      });
    });
  });
});