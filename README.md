#AltCanvas
This is a prototype primitive replacement for HTML5 Canvas. Instead of using <canvas> tags and the associated classes, this replacement uses the standard <img> tag and creates base64 encoded bitmaps that are editable in a friendly way.

##How it works
The user first defines the AltCanvas by supplying the `img` tag it will reference, the desired width, and height. From there an array of white pixels in the dimensions specified is created. The physical image tag in the HTML is also now resized to the specified dimensions.

From this point, nothing is executed until the user runs `Canvas.prototype.displayImage`, in which a series of functions are then executed. The first of which is the `Canvas.prototype.formatData` function that converts the array into a flat pixel list compatible with Bitmap specifications. The function `Canvas.prototype.createFile` is then executed, which creates the header on the fly, appends the formatted pixel data, and converts to base64.

From there, the `img` tag `src` is then modified with the new image information.

##Demo Features
To show this in action, two features have been implemented directly into the `Canvas` class; `drawPixel` and `drawRectangle`.

###drawPixel
The `Canvas.prototype.drawPixel` feature accepts two arguments: `x` and `y`. `drawPixel` is a slight misnomer as you are allowed to draw pixels that have a diameter larger than a single pixel, however it is always in square form and centered around the specified `x` and `y` input.

To modify the size of the pixel, you can set the `Canvas.style.brushSize` parameter to any valid integer. Modifying the color is a simple matter of setting the `Canvas.style.brushColor` to an RGB array of values between 1 and 255.

The following code creates a 200x200 canvas over the img tag with an id `canvas` and fills it with a single orange pixel with a diameter of 10px.

```javascript
canvas.init(document.getElementById('canvas'), 200, 200); // initialize the canvas

canvas.setBrushSize(10); // set brush size to 10px diameter
canvas.setBrushColor(255, 165, 0); // set r, g, b values for brush color

canvas.drawPixel(50, 80); // center the pixel at (x, y) -> (50, 80)

canvas.displayImage();
```

###drawRectangle
The `Canvas.prototype.drawRectangle` feature accepts four arguments: `x1`, `x2`, `y1`, and `y2`. This defines all four vertices of the rectangle. Brush color will also change the fill color of the rectangle. Use it as in the example below:

```javascript
canvas.init(document.getElementById('canvas'), 200, 200); // initialize the canvas

canvas.setBrushColor(255, 165, 0); // set r, g, b values for brush color
canvas.drawRectangle(20, 120, 60, 100);

canvas.displayImage();
```

##In the Pipeline
A few features are in the pipeline for the future:

1. Only re-writing portions of the modified arrays if only portions of the canvas has changed.
2. More demo features to make accessing canvas properties more user-friendly.

##Demo
You can check out a demo at http://www.lavancier.com/AltCanvas/
