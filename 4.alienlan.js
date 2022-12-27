// const reg=/((pa){0,1}|(pagugu(pa){0,1}gugugupa))+/
const reg = /(pa|gu)/g;
// const str = "gugugupagugugupa";
const str = "pagugugugugupa";
let r;
const list = [];
while ((r = reg.exec(str))) {
  list.push({ type: r[0] });
}
list.push({ type: "EOF" });

// blist(list);
// alist(list);
abc(list);
console.log(JSON.stringify(list, null, "    "));

function a(words) {
  if (words[1].type === "gu" && words[2].type === "gu") {
    const symbol = {
      type: "a",
    };
    symbol.children = words.splice(0, 3, symbol);
  }
}

function b(words) {
  if (
    words[1].type === "gu" &&
    words[2].type === "gu" &&
    words[3].type === "pa"
  ) {
    const symbol = {
      type: "b",
    };
    symbol.children = words.splice(0, 4, symbol);
  }
}

function c(words) {
  const symbol = {
    type: "c",
  };
  symbol.children = words.splice(0, 1, symbol);
}

function blist(words) {
  if (words[0].type === "gu") {
    b(words);
    blist(words);
  } else if (words[0].type === "b") {
    if (words[1].type === "EOF") {
      const symbol = {
        type: "blist",
      };
      symbol.children = words.splice(0, 1, symbol);
    } else if (words[1].type === "gu") {
      const word = words.shift();
      blist(words);
      const symbol = {
        type: "blist",
      };
      symbol.children = [word, ...words.splice(0, 1)];
      words.unshift(symbol);
    }
  }
}

function abc(words) {
  if (words[0].type === "gu") {
    blist(words);
  } else if (words[0].type === "pa") {
    if (words[1].type === "EOF") {
      // c
      c(words);
    } else if (
      //ac
      words[1].type === "gu" &&
      words[2].type === "gu" &&
      words[3].type === "pa"
    ) {
      const symbol = {
        type: "abc",
        children: [],
      };
      alist(words);
      symbol.children.push(words.shift());
      c(words);
      symbol.children.push(words.shift());
      words.unshift(symbol);
    } else if (
      // cb
      words[1].type === "gu" &&
      words[2].type === "gu" &&
      words[3].type === "gu" &&
      words[3].type === "pa"
    ) {
      const symbol = {
        type: "abc",
        children: [],
      };
      c(words);
      symbol.children.push(words.shift());
      blist(words);
      symbol.children.push(words.shift());
      words.unshift(symbol);
    } else if (
      words[1].type === "gu" &&
      words[2].type === "gu" &&
      words[3].type === "gu" &&
      words[4].type === "gu"
    ) {
      const symbol = {
        type: "abc",
        children: [],
      };
      alist(words);
      symbol.children.push(words.shift());
      blist(words);
      symbol.children.push(words.shift());
      words.unshift(symbol);
    }
  }
}

function alist(words) {
  if (words[0].type === "pa") {
    a(words);
    alist(words);
  } else if (words[0].type === "a") {
    if (
      words[1].type === "EOF" ||
      (words[1].type === "pa" && words[2].type === "EOF")
    ) {
      const symbol = {
        type: "alist",
      };
      symbol.children = words.splice(0, 1, symbol);
    } else if (words[1].type === "pa") {
      const word = words.shift();
      alist(words);
      const symbol = {
        type: "alist",
      };
      symbol.children = [word, ...words.splice(0, 1)];
      words.unshift(symbol);
    }
  }
}
