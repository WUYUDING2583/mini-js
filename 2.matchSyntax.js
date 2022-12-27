const target = `let string2 = "1234567";
let r;
while ((r = ranReg1.exec(string2))) {
  console.log(r);
}
`;

const keyReg =
  /(const|let|var|null|undefined|while)|( |\n|\t)|([a-zA-Z_$][a-zA-Z0-9_$]*)|([=\(\)\{\};\.])|("[^"]*")/g;

const stringReg =
  /\"([^"\n\t\r\\\u2029\u2028]|\u[0-9a-fA-F]{4}|^"\n\t\r\\\u2029\u2028]|\\[\s\S])*\"|\'([^"\n\t\r\\\u2029\u2028]|\u[0-9a-fA-F]{4}|^"\n\t\r\\\u2029\u2028]|\\[\s\S])*\'/;
let val;

console.log("New Record===========================");
while ((val = keyReg.exec(target))) {
  const key = val[0];
  const { index } = val;
  const t = `key: ${key}, index: ${index}`;
  if (val[1]) {
    console.log("keywords: " + val[1]);
  } else if (val[2]) {
    console.log("whitespace: " + JSON.stringify(val[2]));
  } else if (val[3]) {
    console.log("identifier: " + val[3]);
  } else if (val[4]) {
    console.log("punctuator: " + val[4]);
  } else if (val[5]) {
    console.log("literal: " + val[5]);
  }
}
