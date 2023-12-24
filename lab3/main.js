function calc(n) {
  const validN = (n) => {
    if (n != undefined &&
        typeof n !== "number" &&
        typeof n !== "bigint") throw new Error("the argument is not a number")
  }
  const validSym = (n) => {
    if (!['+', '-', '*', '/', '%', '**'].includes(symbol))    throw new Error("unsupported sign")
  }
  validN(n)

  let foo = (symbol, num) => {
    validSym(symbol)
    validN(num)
    return calc(eval(n+symbol+num))
  }
  foo.valueOf = () => n
  return foo
}

const value = calc(undefined);
console.log(value + 1)