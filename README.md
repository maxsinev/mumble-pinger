# Mumble Pinger

A Node.js tiny dependency-free implementation of the Mumble [ping protocol](https://wiki.mumble.info/wiki/Protocol).

## Prerequisites

* Node.js 10+

## Installing

```
npm install mumble-pinger
```
## Usage
### Example
Basic example with default parameters:
```js
const create = require('mumble-pinger');
const pinger = create();

(async () => {

  try {
    let response = await pinger.ping('my-mumble-server.com', 1234);
    console.log(response);

  } catch (error) {
    console.log(error);

  } finally {
    pinger.close();
  }

})();
```
### Creation
There are a few params which can be passed to creation process:
```js
const create = require('mumble-pinger');
const pinger = create({
  // max time to wait for server response. In milliseconds
  timeout: 6000,
  // allow a pinger to write some warns to console
  silent: false
});
```
### Ping
```js
pinger.ping(
  'my-mumble-server.com', // server ip or hostname
  1234 // server port
  5000 // [optional] override promise timeout for this request
);
```

### Response
A successful ping promise resolves with object like that:
```js
{ 
  version: 66056,
  // current online
  currentUsers: 0,
  // max server capacity
  maxUsers: 100,
  // bytes per second
  bandwidth: 196608 
}
```

## License

This project is licensed under the MIT License
