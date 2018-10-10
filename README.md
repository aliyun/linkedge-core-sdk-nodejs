# Link Edge Core SDK for Node.js

The package allows developers to write functions on Function Compute in JavaScript, which running within Link Edge.

## Installation
To add this library to your function, you can copy this project to your function's `node_modules` directory. Althrough the step is not necessary, we recommand that you do so as it improves the development experience especially when developing with IDE.

## APIs
* [IoTData#**publish()**](#publish)
* [IoTData#**getThingProperties()**](#getThingProperties)
* [IoTData#**setThingProperties()**](#setThingProperties)
* [IoTData#**callThingService()**](#callThingService)
* [IoTData#**getThingsWithTags()**](#getThingsWithTags)
* [FCClient#**invokeFunction()**](#invokeFunction)

---
<a name="publish"></a>
### IoTData.publish(params, callback)
Publishes messages.

The parameters are:
* `params`: params object，which contains:
	* `topic`: {String} (Required) the topic name to be published.
	* `payload`: {String|Buffer} (Required) the message payload in string or in binary.
* `callback(err)`: a callback function for receiving result, which follows the standard JS practice of setting the first parameter as an error.

---
<a name="getThingProperties"></a>
### IoTData.getThingProperties(params, callback)
Obtains specific properties of a thing.

The parameters are:
* `params`: params object，which contains:
	* `productKey`: {String} (Required) the productKey of the target thing from which to get properties.
	* `deviceName`: {String} (Required) the deviceName of the target thing from which to get properties.
	* `payload`: {Array} (Required) a list of keys that specifies the properties to be obtained.
* `callback(err, data)`: a callback function for receiving result, which follows the standard JS practice of setting the first parameter as an error and the second parameter as the result object.

---
<a name="setThingProperties"></a>
### IoTData.setThingProperties(params, callback)
Updates the properties of a thing.

The parameters are:
* `params`: params object，which contains:
	* `productKey`: {String} (Required) the productKey of the target thing to which to set properties.
	* `deviceName`: {String} (Required) the deviceName of the target thing to which to set properties.
	* `payload`: {Object} (Required) a object consisting of keys and values that specifies the properties to be updated.
* `callback(err)`: a callback function for receiving result, which follows the standard JS practice of setting the first parameter as an error.

---
<a name="callThingService"></a>
### IoTData.callThingService(params, callback)
Calls a specific service of a thing.

The parameters are:
* `params`: params object，which contains:
	* `productKey`: {String} (Required) the productKey of the target thing of which to call a service.
	* `deviceName`: {String} (Required) the deviceName of the target thing of which to call a service.
	* `service`: {String} (Required) the name of the service to be called.
	* `payload`: {String|Buffer} a optional string or binary in JSON that you provided to the service as arguments.
	* `callback(err, [data])`: a callback function for receiving result, which follows the standard JS practice of setting the first parameter as an error and the second parameter as the result object.

---
<a name="getThingsWithTags"></a>
### IoTData.getThingsWithTags(params, callback)
Obtains a list of thing objects, each of which being with all given tags.

The parameters are:
* `params`: params object，which contains:
	*  `payload`: {Array} (Required) a list of `tag` that consisting of `{key: value}`.
* `callback`: a callback function for receiving result, which follows the standard JS practice of setting the first parameter as an error and the second parameter as a list of thing objects.

---
<a name="invokeFunction"></a>
### FCClient.invokeFunction(params, callback)
Invokes a specific function.

The parameters are:
* `params`: params object，which contains:
	* `functionId`: {String} (Required) the id of the function to be invoked. Function name is not supported currently.
	* `invocaionType`: {String} a optional type of the invocation, may be `Sync` or `Async`. It will be `Sync` if not specified.
	* `invokerContext`: {String} a optional invoker-specific information to the invoked function. The invoker information will be passed into the function, and can be choosed through context variable. It must be base64-encoded.
	* `payload`: {String|Buffer} a optional string or binary data that you want to provide to the function as input.
* `callback`: a callback function for receiving result, which follows the standard JS practice of setting the first parameter as an error and the second parameter as the result object.

## License
Apache 2.0
