const test = require("flug");
const { resize } = require("./cell-aspect-ratio");

test("square with target height", ({ eq }) => {
  const result = resize({ debug: false, height: 64, width: 64, target_height: 16 });
  eq(result, {
    numerator: 1,
    denominator: 4,
    pad_x: 0,
    pad_y: 0,
    new_area: 4096,
    new_height: 64,
    new_width: 64,
    new_cell_size: 4,
    resized_height: 16,
    resized_width: 16,
    scale: 0.25,
    cell_size_diff: 0
  });
});

test("square with target width", ({ eq }) => {
  const result = resize({ height: 64, width: 64, target_width: 32 });
  eq(result, {
    numerator: 1,
    denominator: 2,
    pad_x: 0,
    pad_y: 0,
    new_area: 4096,
    new_height: 64,
    new_width: 64,
    new_cell_size: 2,
    resized_height: 32,
    resized_width: 32,
    scale: 0.5,
    cell_size_diff: 0
  });
});

test("1px off screenshot width", ({ eq }) => {
  const result = resize({ height: 768, width: 1023, target_height: 384 });
  eq(result, {
    numerator: 1,
    denominator: 2,
    pad_x: 1,
    pad_y: 0,
    new_area: 786432,
    new_height: 768,
    new_width: 1024,
    resized_height: 384,
    resized_width: 512,
    scale: 0.5,
    new_cell_size: 2,
    cell_size_diff: 0
  });
});

test("3px off screenshot height", ({ eq }) => {
  const result = resize({ height: 765, width: 1023, target_height: 384 });
  eq(result, {
    numerator: 1,
    denominator: 2,
    pad_x: 1,
    pad_y: 1,
    new_area: 784384,
    new_height: 766,
    new_width: 1024,
    resized_height: 383,
    resized_width: 512,
    scale: 0.5,
    new_cell_size: 2,
    cell_size_diff: 0.0078125
  });
});

test("3px off screenshot height and 1/4", ({ eq }) => {
  const result = resize({ height: 765, width: 1023, target_height: 192 });
  eq(result, {
    numerator: 1,
    denominator: 4,
    pad_x: 1,
    pad_y: 3,
    new_area: 786432,
    new_height: 768,
    new_width: 1024,
    resized_height: 192,
    resized_width: 256,
    scale: 0.25,
    new_cell_size: 4,
    cell_size_diff: 0.015625
  });
});

test("square with target height and padding", ({ eq }) => {
  console.time("square with target height and padding");
  const height = 5365;
  const result = resize({
    debug: false,
    height,
    width: 4201,
    target_height: Math.round(height / 100),
    maxDenominator: 100
  });

  // check for floating point issues
  eq(Number.isInteger(result.resized_height), true);
  eq(Number.isInteger(result.resized_width), true);

  eq(result, {
    numerator: 1,
    denominator: 99,
    pad_x: 56,
    pad_y: 80,
    new_area: 23179365,
    new_height: 5445,
    new_width: 4257,
    new_cell_size: 98.99999999999999,
    scale: 0.010101010101010102,
    resized_height: 55,
    resized_width: 43,
    cell_size_diff: 0.35185185185186185
  });
  console.timeEnd("square with target height and padding");
});
