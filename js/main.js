var canvas = new Canvas(),
    canvasElem = document.getElementById('canvas');

function ClickEvents () {
  this.drawRectangle = false;
  this.mouseIsDown = false;
}

ClickEvents.prototype = {
  events: function (div, canvas) {
    var $this = this;
    div.onclick = function (e) {
      if ($this.drawRectangle) {
        $this.mouseDown = !$this.mouseDown;
        if ($this.mouseDown) {
          $this.offset = {
            x: e.offsetX,
            y: e.offsetY
          };
        } else {
          canvas.drawRectangle($this.offset.x, e.offsetX, $this.offset.y, e.offsetY);
          canvas.displayImage();
          $("#time_taken").html(canvas.executeTime.total + "ms");
          console.log(canvas.executeTime);
          $this.offset = null;
        }
      }
    };
    div.onmousemove = function (e) {
      if (!$this.drawRectangle && $this.mouseIsDown) {
        canvas.drawPixel(e.offsetX, e.offsetY);
        canvas.displayImage();
        $("#time_taken").html(canvas.executeTime.total + "ms");
        console.log(canvas.executeTime);
      }
    };
    div.onmousedown = function (e) {
      $this.mouseIsDown = true;
    };
    div.onmouseup = function (e) {
      $this.mouseIsDown = false;
    };
    div.ondragstart = function (e) {
      return false;
    };
  }
};

// --- init canvas and add settings --- //
canvas.init(canvasElem, 300, 300)
      .setPixelSize($("#brush_size")[0].defaultValue = 20)
      .setBackgroundColor(255,165,0)
      .setFillColor(230, 230, 230)
      .displayImage();
// ------------------------------------ //

// --- init doc events --- //
var DocEvents = new ClickEvents();
DocEvents.events(canvasElem, canvas);

$(".ind-color").click(function (e) {
  var color = e.target.className.split(" ")[1]; // get the color name (second class)
  canvas.setFillColor(JSON.parse(document.getElementsByClassName(color)[0].getAttribute('color'))); // get color attr value (array) and apply
});

$("#brush_size").on("change", function () {
  canvas.setPixelSize(parseInt($(this).val(), 10));
}); // change the canvas brush size on slider change


$(".option").click(function (e) {
  $(".option").each(function () {
    $(this).removeClass("selected"); // orange -> grey
  });
  $(this).addClass("selected"); // grey -> orange
  if ($(this).hasClass("rectangle")) {
    DocEvents.drawRectangle = true;
  } else {
    DocEvents.drawRectangle = false;
  }
});
// ----------------------- //
