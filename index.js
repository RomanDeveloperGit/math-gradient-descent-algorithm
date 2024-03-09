import * as math from "mathjs";

// Предположим, что имеем нейросеть вида: (как в ./example.jpg)

// Входы и ожидаемые выходы тоже отнесу к параметрам
// А веса проинициализирую руками, без рандома
const parameters = {
  i1: 0,
  i2: 0.6,
  i3: 0,

  w11_1: 0.1,
  w12_1: 0.1,
  w13_1: 0.1,
  w21_1: 0.3,
  w22_1: 0.3,
  w23_1: 0.3,
  b11: 0.1,
  b12: 0.1,

  v11: 0, // init
  f11: 0, // init
  v12: 0, // init
  f12: 0, // init

  w11_2: 0.5,
  w12_2: 0.5,
  w13_2: 0.5,
  w21_2: 0.7,
  w22_2: 0.7,
  w23_2: 0.7,
  b21: 0.9,
  b22: 0.9,

  v21: 0, // init
  f21: 0, // init
  v22: 0, // init
  f22: 0, // init

  y1: 1,
  y2: 0,
};

const formula = {
  f: math.parse("1 / (1 + e ^ (-x))"),
  e: math.parse("((f21 - y1) ^ 2 + (f22 - y2) ^ 2) / 2"),
  v11: math.parse("i1 * w11_1 + i2 * w12_1 + i3 * w13_1 + b11"),
  v12: math.parse("i1 * w21_1 + i2 * w22_1 + i3 * w23_1 + b12"),
  v21: math.parse("f11 * w11_2 + f12 * w12_2 + b21"),
  v22: math.parse("f11 * w21_2 + f12 * w22_2 + b22"),
};

const getExtendedE = () => {
  const f11 = formula.f.toString().replace("x", `(${formula.v11.toString()})`);
  const f12 = formula.f.toString().replace("x", `(${formula.v12.toString()})`);
  const f21 = formula.f
    .toString()
    .replace("x", `(${formula.v21.toString()})`)
    .replace("f11", `(${f11})`)
    .replace("f12", `(${f12})`);
  const f22 = formula.f
    .toString()
    .replace("x", `(${formula.v22.toString()})`)
    .replace("f11", `(${f11})`)
    .replace("f12", `(${f12})`);

  return math.parse(
    formula.e.toString().replace("f21", `(${f21})`).replace("f22", `(${f22})`)
  );
};

formula.extendedE = getExtendedE();

const derivativeExtendedE = (varName = "w11_1") => {
  return math
    .derivative(
      formula.extendedE.toString().replace(/_/g, ""),
      varName.replace("_", "")
    )
    .toString();
};

console.log(formula.e.toString());
console.log(formula.extendedE.toString());
console.log("Частная производная по w11_1", derivativeExtendedE("w11_1"));
console.log("Частная производная по b11", derivativeExtendedE("b11"));
console.log("Частная производная по w22_2", derivativeExtendedE("w22_2"));

// // Посчитаем все формульные значения + активационные значения для них
// const calculateValues = () => {
//   Object.keys(formula)
//     .filter((key) => key !== "f" && key !== "e")
//     .forEach((key) => {
//       const expression = formula[key];
//       const expressionValue = expression.evaluate(parameters);

//       console.log(`[${key}]: ${expression.toString()} = ${expressionValue}`);

//       parameters[key] = expressionValue;

//       if (key.includes("v")) {
//         const additionalKey = key.replace("v", "f");

//         parameters[additionalKey] = formula.f.evaluate({
//           x: expressionValue,
//         });

//         console.log(
//           `[${additionalKey}]: ${formula.f.toString()} = ${
//             parameters[additionalKey]
//           }`
//         );
//       }
//     });
// };

// calculateValues();

// // Итого, имеем все параметры
// console.log(parameters);

// const loss = formula.e.evaluate(parameters);
// console.log("loss:", loss);
