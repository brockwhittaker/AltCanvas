function Canvas () {
  this.style = {
    brushSize: 1,
    brushColor: [0,0,0]
  };
}

Canvas.prototype = {
  asHex: function (value, bytes) {
    var result = [];

    while (bytes > 0) {
      bytes--;
      result.push(String.fromCharCode(value & 255));
      value >>= 8;
    }

    return result.join('');
  },

  addData: function (pixelGrid) {
    this.data = pixelGrid;

    return this;
  },

  formatData: function () {
    var padding = "\x00".repeat(this.padding),
        pixel,
        formattedData = "";

    for (var x = this.width - 1; x >= 0; x--) {
      for (var y = 0; y < this.height; y++) {
        pixel = this.data[x][y];
        formattedData += (String.fromCharCode(pixel[2]) || 255);
        formattedData += (String.fromCharCode(pixel[1]) || 255);
        formattedData += (String.fromCharCode(pixel[0]) || 255);
      }
    }

    this.formattedData = formattedData;

    return this;
  },

  initData: function () {
    this.data = new Array(this.width);

    for (var x = 0; x < this.width; x++) {
      this.data[x] = [];
      for (var y = 0; y < this.height; y++) {
        this.data[x][y] = [255,255,255];
      }
    }
  },

  init: function (div, width, height) {
    this.container = div;
    this.width = width;
    this.height = height;
    this.padding = (4 - (this.width * 3) % 4) % 4;
    this.dataSize = (this.width * 3 + this.padding) * this.height;
    this.fileSize = 54 + this.dataSize;

    this.initData();

    this.container.width = width;
    this.container.height = height;

    return this;
  },

  createFile: function () {
    var file = ('BM' +                // "Magic Number"
      this.asHex(this.fileSize, 4) +  // size in bytes
      '\x00\x00' +                    // reserved
      '\x00\x00' +                    // reserved
      '\x36\x00\x00\x00' +            // 54 byte offset for data
      '\x28\x00\x00\x00' +            // number of remaining bytes in header (40 bytes)
      this.asHex(this.width, 4) +     // the width
      this.asHex(this.height, 4) +    // the height
      '\x01\x00' +                    // the number of color planes (1)
      '\x18\x00' +                    // 24 bits / pixel (3 channels)
      '\x00\x00\x00\x00' +            // No compression (0)
      this.asHex(this.dataSize, 4) +  // size of the BMP data (bytes)
      '\x13\x0B\x00\x00' +            // 2835 pixels/meter - horizontal resolution
      '\x13\x0B\x00\x00' +            // 2835 pixels/meter - the vertical resolution
      '\x00\x00\x00\x00' +            // Number of colors in the palette (keep 0 for 24-bit)
      '\x00\x00\x00\x00' +            // 0 important colors (means all colors are important)
      this.formattedData              // the stringified array data
    );

    this.file = btoa(file);

    return this;
  },

  displayImage: function (data) {
    this.executeTime = {
      start: new Date() * 1,
      end: null,
      total: null
    };

    if (data) {
      this.addData(data);
    }

    this.formatData()
        .createFile();

    this.container.src = 'data:image/bmp;base64,' + this.file;

    this.executeTime.end = new Date() * 1;
    this.executeTime.total = this.executeTime.end - this.executeTime.start;

    return this;
  },

  /* --- drawing extensions here --- */

  setPixelSize: function (size) {
    this.style.brushSize = parseInt(size, 10);

    return this;
  },

  setFillColor: function (r, g, b) {
    if (typeof r === "object") {
      this.style.brushColor = r;
    } else if (r && g && b) {
      this.style.brushColor = [parseInt(r, 10), parseInt(g, 10), parseInt(b, 10)];
    } else {
      console.log("Invalid input. Please input a red, green, and blue value between 0 and 255.");
    }

    return this;
  },

  setBackgroundColor: function (r, g, b) {
    for (var x = 0; x < this.width; x++) {
      this.data[x] = [];
      for (var y = 0; y < this.height; y++) {
        this.data[x][y] = [r, g, b];
      }
    }

    return this;
  },

  drawPixel: function (x, y) {
    var b = this.style.brushSize;

    for (var i = 0; i < b; i++) {
      for (var j = 0; j < b; j++) {
        try {
          this.data[y + i - Math.round(b / 2)][x + j - Math.round(b / 2)] = this.style.brushColor;
          // it's y then x because each y has a container of x...
        } catch (e) {
          // silence..
        }
      }
    }

    return this;
  },

  drawRectangle: function (x1, x2, y1, y2) {
    for (var i = Math.min(x1, x2); i < Math.max(x1, x2); i++) {
      for (var j = Math.min(y1, y2); j < Math.max(y1, y2); j++) {
        this.data[j][i] = this.style.brushColor;
      }
    }

    return this;
  }
};
