const CHAR_SEQ = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const randomChars = (count) => {
  let result = '';
  for (let i = 0; i < count; i++) {
    const index = Math.floor((Math.random() * (CHAR_SEQ.length + 1)));
    result += CHAR_SEQ.charAt(index);
  }
  return result;
}

const codesFromChars = (str) => {
  return Array.prototype.map.call(str, (char) => char.charCodeAt())
}

const charsFromCodes = (arr) => {
  return arr.reduce((acc, code) => acc += String.fromCharCode(code), '')
}

const bytesToUint32 = (arr) => {
  let result = [];
  for (let i = 0; i < arr.length; i += 4) {
    let temp = 0;
    for (let j = 0; j < 4; j++) {
      temp += arr[i + j] << (4 - 1 - j) * 8
    }
    result.push(temp);
  }
  return result;
}

const timeoutPromise = (time) => {
  let timeout, result;
  let promise = new Promise((resolve, reject) => {
    timeout = setTimeout(() => reject(new Error('Promise timeout exceeded.')), time);
    result = {
      timeout,
      resolve: (data) => { clearTimeout(timeout); resolve(data); },
      reject: (err) => { clearTimeout(timeout); reject(err); } 
    }
  });
  result.promise = promise;
  return result;
}

module.exports = {
  bytesToUint32,
  timeoutPromise,
  randomChars,
  codesFromChars,
  charsFromCodes
}