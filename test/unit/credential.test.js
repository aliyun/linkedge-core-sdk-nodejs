/*
 * Copyright (c) 2018 Alibaba Group Holding Ltd. All rights reversed.
 */

const should = require('should');
const sinon = require('sinon');

const leSdk = require('linkedge-core-sdk');
const common = require('linkedge-common-js');

describe('CredentialProviderChain', function () {
  describe('#get', function () {
    afterEach(function () {
      process.env.DEFFAULT_CREDENTIALS_RELATIVE_URI = undefined;
    });
    it('should fail since can not find environment variable DEFFAULT_CREDENTIALS_RELATIVE_URI', function (done) {
      (function () {
        new leSdk.CredentialProviderChain();
      }).should.throw();
      done();
    });
    it('should fail since connection has broken', function (done) {
      var stub = sinon.stub(common.ws, 'request').callsFake(function (option, callback) {
        callback(new Error(`Connection has broken`));
      });
      var end = function () {
        stub.restore();
        done();
      };
      process.env.DEFFAULT_CREDENTIALS_RELATIVE_URI = '/test/credentialprovider';
      var cred = new leSdk.CredentialProviderChain();
      cred.resolvePromise().should.be.rejected().then(end, end);
    });
    it('should fail since status code in response is not 200', function (done) {
      var stub = sinon.stub(common.ws, 'request').callsFake(function (option, callback) {
        callback(null, {
          statusCode: 404,
          body: 'Not found'
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      process.env.DEFFAULT_CREDENTIALS_RELATIVE_URI = '/test/credentialprovider';
      var cred = new leSdk.CredentialProviderChain();
      cred.resolvePromise().should.be.rejected().then(end, end);
    });

    it('should fail since credential is not formed in JSON', function (done) {
      var stub = sinon.stub(common.ws, 'request').callsFake(function (option, callback) {
        callback(null, {
          statusCode: 200,
          headers: {
            'X-Provider-Credential': Buffer.from('credential'),
          },
          body: 'Success'
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      process.env.DEFFAULT_CREDENTIALS_RELATIVE_URI = '/test/credentialprovider';
      var cred = new leSdk.CredentialProviderChain();
      cred.resolvePromise().should.be.rejected().then(end, end);
    });
    it('should fail since the requested role arn does not exist', function (done) {
      var stub = sinon.stub(common.ws, 'request').callsFake(function (option, callback) {
        callback(null, {
          statusCode: 400,
          body: 'The requested role arn does not exist.'
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      process.env.DEFFAULT_CREDENTIALS_RELATIVE_URI = '/test/credentialprovider';
      var cred = new leSdk.CredentialProviderChain();
      cred.resolvePromise().should.be.rejected().then(end, end);
    });
    it('should pass since all requirements meet', function (done) {
      var stub = sinon.stub(common.ws, 'request').callsFake(function (option, callback) {
        callback(null, {
          statusCode: 200,
          headers: {
            'X-Provider-Credential': JSON.stringify({
              accessKeyId: 'Test Product Key',
              accessKeySecret: 'Test Product Key',
              stsToken: 'Test Security Token',
            }),
          },
        });
      });
      var end = function () {
        stub.restore();
        done();
      };
      process.env.DEFFAULT_CREDENTIALS_RELATIVE_URI = '/test/credentialprovider';
      var cred = new leSdk.CredentialProviderChain();
      cred.resolvePromise().should.not.be.rejected().then(end, end);
    });
  });
});