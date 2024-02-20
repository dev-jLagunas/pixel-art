// Inspired by [ASMR Programming]'s Pixel Art Generator tutorial on YouTube
// Original video at: [https://www.youtube.com/watch?v=DfDPJqD3FjI&t=16s]

//Import Styles
import "./style.scss";

//Select Dom Elements
let gridWidthInput = document.getElementById("width-range");
let gridHeightInput = document.getElementById("height-range");
let widthNumValue = document.getElementById("width-value");
let heightNumValue = document.getElementById("height-value");

let createGridBtn = document.getElementById("create-btn");
let clearGridBtn = document.getElementById("clear-btn");
let colorSelect = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
const screenshotBtn = document.getElementById("screenshot-btn");

let gridContainer = document.querySelector(".grid-container");

//Global Variables
let deviceType = "";
let draw = false;
let erase = false;

let events = {
  mouse: {
    down: "mousedown",
    move: "mousemove",
    up: "mouseup",
  },
  touch: {
    down: "touchstart",
    move: "touchmove",
    up: "touchend",
  },
};

//Confirm Touch/Non-Touch Device
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

isTouchDevice();

//Event Listeners
window.addEventListener("DOMContentLoaded", () => {
  gridHeightInput.value = 0;
  gridWidthInput.value = 0;
});

createGridBtn.addEventListener("click", createGrid);

clearGridBtn.addEventListener("click", () => {
  gridContainer.innerHTML = "";
});

eraseBtn.addEventListener("click", () => {
  erase = true;
  if (erase) {
    eraseBtn.classList.add("true");
    paintBtn.classList.remove("true");
  }
});

paintBtn.addEventListener("click", () => {
  erase = false;
  if (!erase) {
    paintBtn.classList.add("true");
    eraseBtn.classList.remove("true");
  }
});

gridHeightInput.addEventListener("input", () => {
  heightNumValue.innerHTML =
    gridHeightInput.value < 9
      ? `0${gridHeightInput.value}`
      : gridHeightInput.value;
});

gridWidthInput.addEventListener("input", () => {
  widthNumValue.innerHTML =
    gridWidthInput.value < 9
      ? `0${gridWidthInput.value}`
      : gridWidthInput.value;
});

screenshotBtn.addEventListener("click", takeScreenshot);

//Function - Paint Pixel Div
function paintCell(elementId) {
  let gridColumns = document.querySelectorAll(".gridCol");
  gridColumns.forEach((element) => {
    if (elementId === element.id) {
      if (draw && !erase) {
        element.style.backgroundColor = colorSelect.value;
      } else {
        element.style.backgroundColor = "transparent";
      }
    }
  });
}

//Function - Create Grid
function createGrid() {
  gridContainer.innerHTML = "";
  let count = 0;
  for (let i = 0; i < gridHeightInput.value; i++) {
    count += 2;
    const row = document.createElement("div");
    row.classList.add("gridRow");

    for (let j = 0; j < gridWidthInput.value; j++) {
      count += 2;
      const cell = document.createElement("div");
      cell.classList.add("gridCol");
      cell.setAttribute("id", `gridCol${count}`);
      enableDrawingLogic(cell);
      row.appendChild(cell);
    }

    gridContainer.appendChild(row);
  }
}

//Function - Enable/Disable Drawing On Grid Cells
function enableDrawingLogic(cell) {
  //single click/touch event
  cell.addEventListener(events[deviceType].down, () => {
    draw = true;
    if (erase) {
      cell.style.backgroundColor = "transparent";
    } else {
      cell.style.backgroundColor = colorSelect.value;
    }
  });

  //multiple click/touch event
  cell.addEventListener(events[deviceType].move, (e) => {
    if (!draw) return;
    let elementId = document.elementFromPoint(
      !isTouchDevice() ? e.clientX : e.touches[0].clientX,
      !isTouchDevice() ? e.clientY : e.touches[0].clientY
    ).id;
    paintCell(elementId);
  });

  //Stop click/touch event
  cell.addEventListener(events[deviceType].up, () => {
    draw = false;
  });
}

//Function Screenshot Artwork
function takeScreenshot() {
  if (gridContainer.children.length > 0) {
    html2canvas(gridContainer).then(function (canvas) {
      const link = document.createElement("a");
      link.download = "screenshot.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  } else {
    alert("The grid is empty");
  }
}
