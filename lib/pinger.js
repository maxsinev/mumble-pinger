const {
  randomChars,
  charsFromCodes,
  codesFromChars,
  timeoutPromise,
  bytesToUint32
} = require('./util');

const dgram = require('dgram');

const DATAGRAM_SHIFT = [0, 0, 0, 0];
const DATAGRAM_ID_LENGTH = 8;
const DEFAULT_REQUEST_TIMEOUT = 3000; // ms

const createDatagram = (data) => new Uint8Array(
  DATAGRAM_SHIFT.concat(codesFromChars(data))
);

/**
 * Create UDP Mumble socket pinger 
 * @param {Object} options Pinger options
 */
const createPinger = (options) => {
  const requestHeap = {};
  const { timeout, silent } = Object.assign({
    // default params
    silent: false,
    timeout: DEFAULT_REQUEST_TIMEOUT
  }, options);

  const processResponse = (msg, info) => {
    const requestId = charsFromCodes(msg.slice(4, 12));
    const request = requestHeap[requestId];
    delete requestHeap[requestId];
    let response;

    if (!request) {
      !silent && console.warn(`[Mumble-pinger] Received unknown request with id: ${requestId}`);
      return;
    }

    const version = bytesToUint32(msg.slice(0, 4));
    const rest = bytesToUint32(msg.slice(12));
    response = {
      version: version[0],
      currentUsers: rest[0],
      maxUsers: rest[1],
      bandwidth: rest[2]
    };

    request.resolve(response);
  }

  const server = dgram.createSocket('udp4');
  server.on('message', processResponse);

  /**
   * Send ping data to a passed server
   * @param {String} host Server host name or IP
   * @param {number} port Server port
   * @param {number} [requestTimeout] Max milliseconds count to wait for a server response
   * @returns {Promise} Request promise
   */
  const ping = (host, port, requestTimeout) => {
    const requestId = randomChars(DATAGRAM_ID_LENGTH); // use random chars as request id and as protocol 8 bytes structure
    const datagram = createDatagram(requestId);
    const request = timeoutPromise(requestTimeout || timeout);
    server.send(datagram, port, host, (err) => {
      if (err) request.reject(err)
      else requestHeap[requestId] = request;
    });
    return request
      .promise
      .catch((err) => {
        delete requestHeap[requestId];
        throw err;
      })
  }

  const close = () => {
    server.close();
  }

  return { ping, close }
}

module.exports = createPinger;