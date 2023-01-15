function start(character) {
  if (character === "-") {
    return afterMinus;
  } else if (isNumber(character)) {
    if (character === "0") return afterZero;
    return afterNumber;
  } else if (character === ".") {
    return afterDot;
  } else {
    return fail;
  }
}

function afterMinus(character) {
  if (character === EOF) {
    return fail;
  } else if (isNumber(character)) {
    if (character === "0") return afterZero;
    return afterNumber;
  } else if (character === ".") {
    return afterDot;
  } else {
    return fail;
  }
}

function afterNumber(character) {
  if (character === EOF) {
    return success;
  } else if (isNumber(character)) {
    return afterNumber;
  } else if (character === ".") {
    return afterDot;
  } else if (character === EOF) {
    return success;
  } else {
    return fail;
  }
}

function afterDot(character) {
  if (character === EOF) return success;
  if (isNumber(character)) {
    return afterDot;
  } else {
    return fail;
  }
}

function afterZero(character) {
  if (character === EOF) {
    return success;
  } else if (character === ".") {
    return afterDot;
  } else {
    return fail;
  }
}

function isNumber(character) {
  return (
    character.charCodeAt(0) >= "0".charCodeAt(0) &&
    character.charCodeAt(0) <= "9".charCodeAt(0)
  );
}

function success(character) {
  throw new Error("error");
}

function fail(character) {
  return fail;
}

const number = "0.12";
const EOF = Symbol("EOF");

/**
 * 每一个state都是一个状态机：包含输入输出和转移关系
 * mealy型状态机 下一个状态的返回值与输入相关
 * moore型状态机 知道一个状态以后，进下一个状态是固定的
 */
function check(str) {
  let state = start;
  for (const c of str.split("")) {
    state = state(c);
  }
  state = state(EOF);
  if (state === success) {
    return true;
  }
  return false;
}

console.log(check(number));

/**
 * KMP算法
 */

function find(source, pattern) {
  for (let i = 0; i < source.length; i++) {
    let k = i;
    let j = 0;
    for (; j < pattern.length; j++) {
      if (source[k] === pattern[j]) {
        k++;
      } else {
        break;
      }
    }
    if (j === pattern.length) return i;
  }
}
console.log("find", find("asdf", "df"));

/**
 * 假设pattern中所有字符全不同
 */

function find2(source, pattern) {
  let j = 0;
  let i = 0;
  for (; i < source.length; i++) {
    if (j === pattern.length) return i - pattern.length;
    if (source[i] === pattern[j]) {
      j++;
    } else {
      j = 0;
      continue;
    }
  }
  if (j === pattern.length) return i - pattern.length;
  return -1;
}
console.log("find2", find2("asdf", "df"));

/**
 * source : abababc
 * pattern:   ababc
 *              ^
 *
 */

function find3(source, pattern) {
  const next = [0, 0, 0, 1, 2];
  let j = 0;
  let i = 0;
  for (; i < source.length; i++) {
    if (j === pattern.length) return i - pattern.length;
    if (source[i] === pattern[j]) {
      j++;
    } else {
      j = next[j];

      continue;
    }
  }
  if (j === pattern.length) return i - pattern.length;
  return -1;
}

console.log("find3", find3("abababc", "ababc"));
