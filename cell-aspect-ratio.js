/**
 * @name resize
 * @description calculates the padding needed to resize a grid without compromising the square shape of the cells
 * @param {Number} cell_size - the "real world" height and width that each square cell represents
 * @param {Boolean} debug - set to true to log for debugging purposes
 * @param {Number} height - height of the grid system (e.g. height of an image in pixels)
 * @param {Number} width - width of the grid system (e.g. width of an image in pixels)
 * @param {Number=} target_height - height that you want to resize to
 * @param {Number=} target_width - width that you want to resize to
 * @param {Number=} scale - resizing scale. 0.5 is to make the image twice as small
 * @param {Number=10} maxDenominator - highest number of common denominator to search for
 * @returns {Object} information about how much to pad the grid
 */
function resize({
  cell_size = 1,
  debug = false,
  height,
  width,
  target_height,
  target_width,
  scale,
  maxDenominator = 100
}) {
  if (debug) console.log("[cell-aspect-ratio] starting");

  if (typeof target_height === "number" && typeof target_width === "number") {
    const scaleY = target_height / height;
    const scaleX = target_width / width;
    if (scaleX !== scaleY) {
      throw new Error("[cell-aspect-ratio] can't set height and width");
    }
    scale = scaleY;
  } else if (typeof target_height === "number") {
    scale = target_height / height;
  } else if (typeof target_width === "number") {
    scale = target_width / width;
  } else {
    throw new Error("[cell-aspect-ratio] you must specify a target_height or target_width");
  }
  if (debug) console.log("scale:", scale);

  const fractions = [];
  for (let i = 1; i <= maxDenominator; i++) {
    for (let ii = 1; ii <= i; ii++) {
      const quotient = ii / i;
      // dont' want to include uncessary fractions with smaller possible denominators
      // in other words, don't need to include 2/4, 3/6, and so on if including 1/2
      if (!fractions.find(f => f.quotient === quotient)) {
        fractions.push({ numerator: ii, denominator: i, quotient });
      }
    }
  }
  if (debug) console.log(`considering ${fractions.length} fractions`);

  const target_cell_size = cell_size / scale;
  if (debug) console.log("targeting cell size of", target_cell_size);

  // go through denominators and figure out necessary padding,
  // so height and width share a common denominator
  const denominators = {};
  for (let denominator = 1; denominator <= maxDenominator; denominator++) {
    const pad_x = (denominator - (width % denominator)) % denominator;
    const pad_y = (denominator - (height % denominator)) % denominator;

    const new_width = width + pad_x;
    const new_height = height + pad_y;
    denominators[denominator] = {
      pad_x,
      pad_y,
      new_width,
      new_height,
      new_area: new_width * new_height,
      pad_diff: Math.abs(pad_x - pad_y)
    };
  }

  const options = fractions.map(({ numerator, denominator, quotient }) => {
    const { pad_x, pad_y, new_area, new_width, new_height } = denominators[denominator];

    const new_cell_size = cell_size / quotient;

    // figure out diff in new_cell_size from target_cell_size
    const cell_size_diff = Math.abs(target_cell_size - new_cell_size);

    return {
      numerator,
      denominator,
      pad_x,
      pad_y,
      new_area,
      new_height,
      new_width,
      new_cell_size,
      scale: quotient,

      // we don't reuse quotient here because we want to avoid floating point imprecision
      // by multiplying before dividing (instead of reusing quotient) we increase the
      // "left-hand" side of the number being divided improving the precision
      // of the division
      resized_height: (new_height * numerator) / denominator,
      resized_width: (new_width * numerator) / denominator,
      cell_size_diff
    };
  });

  // sort and pick option with closest match in resolution
  options.sort((a, b) => Math.sign(a.cell_size_diff - b.cell_size_diff));

  const selection = options[0];

  if (!selection) {
    throw new Error("[cell-aspect-ratio] unable to determine how to pad and resize while preserving square cell size");
  }

  if (debug) console.log("[cell-aspect-ratio] returning", selection);

  return selection;
}

module.exports = { resize };
