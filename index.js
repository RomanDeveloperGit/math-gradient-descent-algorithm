import * as math from "mathjs";

// Предположим, что имеем нейросеть вида: (как в ./example.jpg)

// Входы и ожидаемые выходы тоже отнесу к параметрам
// А веса проинициализирую руками, без рандома
const parameters = {
  i1: 0.1,
  i2: 0.2,
  i3: 0.3,

  w11_1: 0.2,
  w12_1: 0.2,
  w13_1: 0.2,
  w21_1: 0.2,
  w22_1: 0.2,
  w23_1: 0.2,
  b11: 0.2,
  b12: 0.2,

  w11_2: 0.2,
  w12_2: 0.2,
  w13_2: 0.2,
  w21_2: 0.2,
  w22_2: 0.2,
  w23_2: 0.2,
  b21: 0.2,
  b22: 0.2,

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

// Посчитаем все формульные значения + добавим активационные значения для них
Object.keys(formula)
  .filter((key) => key !== "f" && key !== "e")
  .forEach((key) => {
    const expression = formula[key];
    const expressionValue = expression.evaluate(parameters);

    console.log(`[${key}]: ${expression.toString()} = ${expressionValue}`);

    if (!(key in parameters)) {
      parameters[key] = expressionValue;

      if (key.includes("v")) {
        const additionalKey = key.replace("v", "f");

        parameters[additionalKey] = formula.f.evaluate({
          x: expressionValue,
        });

        console.log(
          `[${additionalKey}]: ${formula.f.toString()} = ${
            parameters[additionalKey]
          }`
        );
      }
    }
  });

// Итого, имеем все параметры
console.log(parameters);

const loss = formula.e.evaluate(parameters);
console.log("loss:", loss);


