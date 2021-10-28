# cell aspect ratio
> Utility Functions for working with Cell Aspect Ratios

# install
```bash
npm install cell-aspect-ratio
```

# what is a cell aspect ratio?
**Cell Aspect Ratio (CAR)** is the ratio of "real world" height to width for cells in a grid.  It's best understood in contrast to [Pixel Aspect Ratio](https://en.wikipedia.org/wiki/Pixel_aspect_ratio) (PAR).  Whereas PAR refers to the dimensions of a pixel or cell in "pixels", CAR refers to the dimensions of a pixel or cell in meters or degrees.

# the resize problem
This library was created to solve a particular image/grid resizing problem.
When a grid's height and width don't share a common denominator, it's impossible
to resize the image without introducing some image stretching.  This image stretching
is often undetectable to the human eye, but for geospatial or scientific calculations this is important.  Additionally, at least one GeoSpatial format, [ASCII Grid](https://en.wikipedia.org/wiki/Esri_grid#:~:text=indicate%20such%20registration.-,cellsize,-is%20the%20length), requires
that all cells be squares with the same height and width.  I need a way to resize
without introducing small changes in the height vs. width ratio. 

# usage
```js
import { resize } from "cell-aspect-ratio";
// or const { resize } = require("cell-aspect-ratio");

const result = resize({
  debug: false,
  height: 5365,
  width: 4201,
  target_height: 54,
  maxDenominator: 100
});
```
result is an object with information needed to resize the grid precisely
```js
{
  numerator: 1,
  denominator: 99,
  pad_x: 56, // how many empty no-data columns to add to your grid before resizing
  pad_y: 80, // how many empty no-data rows to add to your grid before resizing
  new_area: 23179365,
  new_height: 5445,
  new_width: 4257,
  new_cell_size: 98.99999999999999,
  scale: 0.010101010101010102,
  resized_height: 55,
  resized_width: 43,
  cell_size_diff: 0.35185185185186185
}
```
