/**
 * <IncreaseExpression>::= <Number> "++" | "++" <Number>
 *
 * Support bracket
 * <PrimaryExpression>::= "(" <Expression> ")" | <IncreaseExpression>
 *
 * <UnaryExpression>::= <PrimaryExpression> | "+" <PrimaryExpression> | "-" <PrimaryExpression>
 *
 * <MultiplicativeExpression>::=<UnaryExpression> | <MultiplicativeExpression> '/' <UnaryExpression> | <MultiplicativeExpression> '*' <UnaryExpression>
 * <AdditiveExpression>::=<MultiplicativeExpression> | <AdditiveExpression> '+'  <MultiplicativeExpression> | <AdditiveExpression> '-'  <MultiplicativeExpression>
 *
 * <Expression>::=<AdditiveExpression>
 *
 * <LogicAndExpression>::= <Expression> | <LogicAndExpression> '&&' <Expression>
 * <LogicOrExpression>::= <LogicAndExpression> | <LogicOrExpression> '||' <LogicAndExpression>
 *
 * right association operator = **
 * <AssignmentExpression>::=<LogicOrExpression> | <LogicOrExpression> "=" <AssignmentExpression>
 *
 * <CommaExpression>::=<LogicOrExpression> | <CommaExpression> ","<LogicOrExpression>
 *
 *
 * <IfStatement>::=<CommaExpression> | "if" "(" <CommaExpression> ")" <CommaExpression>
 *
 * <SemicolonExpression>::=<ExpressionGroup> | <SemicolonExpression> ";"<ExpressionGroup>
 *
 */

const NUMBER = "NUMBER";
const ADD = "ADD";
const MINUS = "MINUS";
const MULTIPLE = "MULTIPLE";
const DIVISION = "DIVISION";
const BRACKET = "BRACKET";
const reg =
  /([1-9][0-9]{0,}(?:\.[0-9]+){0,1}|0\.[0-9]{1,}|0)|(\+)|(\-)|(\*)|(\/)/g;
const str = "1+2.99-0.78*45/56";
let r;
const list = [];
while ((r = reg.exec(str))) {
  let type;
  if (r[1]) type = NUMBER;
  else if (r[2]) type = ADD;
  else if (r[3]) type = MINUS;
  else if (r[4]) type = MULTIPLE;
  else if (r[5]) type = DIVISION;
  list.push({ type, value: r[0] });
}
list.push({ type: "EOF" });
additiveExpression(list);
console.log(JSON.stringify(list, null, "  "));

/**
 * Closure of Additive
 * Additive的闭合集
 * <AdditiveExpression>::=
 * <MultiplicativeExpression> |
 * <AdditiveExpression> '+'  <MultiplicativeExpression> |
 * <AdditiveExpression> '-'  <MultiplicativeExpression> |
 * <PrimaryExpression> |
 * <MultiplicativeExpression> '/' <PrimaryExpression> |
 * <MultiplicativeExpression> '*' <PrimaryExpression> |
 * "(" <Expression> ")" |
 * <Number>
 */

function expression(list) {
  const [first, second] = list;
  if (first.type === NUMBER || first.type === BRACKET) {
    bracketExpression(list);
    expression(list);
  } else if (first.type === "additiveExpression") {
    if (second.type === "EOF") return;
    if ([MINUS, ADD].includes(second.type)) {
      additiveExpression(list);
      expression(list);
    }
  } else if (first.type === "multiplicativeExpression") {
    if ([MULTIPLE, DIVISION].includes(second.type)) {
      multiplicativeExpression(list);
    } else {
      additiveExpression(list);
    }
    expression(list);
  } else if (first.type === "bracketExpression") {
    multiplicativeExpression(list);
    expression(list);
  }
}

function additiveExpression(expressions) {
  if (expressions[0].type === NUMBER) {
    multiplicativeExpression(expressions);
    additiveExpression(expressions);
  } else if (expressions[0].type === "multiplicativeExpression") {
    const symbol = {
      type: "additiveExpression",
    };
    symbol.children = expressions.splice(0, 1, symbol);
    additiveExpression(expressions);
  } else if (expressions[0].type === "additiveExpression") {
    if (expressions[1].type === "EOF") {
      return;
    } else {
      const children = expressions.splice(0, 2);
      multiplicativeExpression(expressions);
      children.push(expressions.shift());
      const symbol = {
        children,
        type: "additiveExpression",
      };
      expressions.unshift(symbol);
      additiveExpression(expressions);
    }
  }
}

function multiplicativeExpression(expressions) {
  if (expressions[0].type === NUMBER) {
    const symbol = {
      type: "multiplicativeExpression",
    };
    symbol.children = expressions.splice(0, 1, symbol);
    multiplicativeExpression(expressions);
  } else if (expressions[0].type === "multiplicativeExpression") {
    if ([MINUS, ADD, "EOF"].includes(list[1].type)) {
      return;
    }
    const symbol = {
      type: "multiplicativeExpression",
    };
    symbol.children = expressions.splice(0, 3, symbol);
  }
}

let result = "";

function revert(item) {
  if (item.children) {
    item.children.forEach(revert);
  } else {
    result += item.value;
  }
}
revert(list[0]);
console.log(result);
