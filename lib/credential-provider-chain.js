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

const HEADER_AUTH_TOKEN = 'Authorization';

class CredentialProviderChain {
  constructor() {
    this.providers = [];
    this.providers.push(new DefaultCredentialProvider());
  }

  resolvePromise() {
    return this.providers[0].get();
  }
}

class DefaultCredentialProvider {
  constructor() {
    if (process.env.DEFFAULT_CREDENTIALS_RELATIVE_URI) {
      this._relativeUri = process.env.DEFFAULT_CREDENTIALS_RELATIVE_URI;
      var common = require('linkedge-common-js');
      this._ws = common.ws;
      this._authToken = common.envVars.AUTH_TOKEN;
      this._functionId = common.envVars.MY_FUNCTION_ID;
    } else {
      throw new Error(`Can not construct default credential provider!`);
    }
  }

  get() {
    return new Promise((resolve, reject) => {
      var options = {
        method: 'GET',
        path: this._relativeUri,
        headers: {
          [HEADER_AUTH_TOKEN]: this._authToken,
        },
      };
      this._ws.request(options, (err, res) => {
        if (err) {
          err = new Error(`Failed to get credential: ${err}.`);
          console.error(err);
          reject(err);
          return;
        }
        if (res.statusCode !== 200) {
          err = new Error(`${res.body}.`);
          reject(err);
          return;
        }
        var cred;
        var credential = res.headers['X-Provider-Credential'];
        try {
          cred = JSON.parse(credential);
        } catch (err) {
          err = new Error(`Can not parse credential from ${credential}.`);
          reject(err);
          return;
        }
        resolve(cred);
      });
    });
  }
}

module.exports = CredentialProviderChain;