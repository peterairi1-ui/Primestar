/* =====================================================
   PRIMESTAR JAVASCRIPT
   ===================================================== */


/* =====================================================
   MOBILE HAMBURGER
   ===================================================== */

const hamburger =
  document.getElementById("hamburger");

const mobileMenu =
  document.getElementById("mobileMenu");


hamburger.addEventListener("click", function () {

  mobileMenu.classList.toggle("active");

});


/* Close menu after clicking a link */

const mobileLinks =
  mobileMenu.querySelectorAll("a");


mobileLinks.forEach(function (link) {

  link.addEventListener("click", function () {

    mobileMenu.classList.remove("active");

  });

});


/* =====================================================
   RESTAURANT HORIZONTAL SLIDER
   ===================================================== */

const slider =
  document.getElementById("restaurantSlider");


let isDragging = false;

let startX = 0;

let startingScroll = 0;


/* =====================================================
   DESKTOP MOUSE DRAG
   ===================================================== */

slider.addEventListener(
  "mousedown",
  function (event) {

    isDragging = true;

    slider.style.scrollBehavior = "auto";

    startX =
      event.pageX -
      slider.offsetLeft;

    startingScroll =
      slider.scrollLeft;

  }
);


window.addEventListener(
  "mouseup",
  function () {

    isDragging = false;

    slider.style.scrollBehavior = "smooth";

  }
);


slider.addEventListener(
  "mousemove",
  function (event) {

    if (!isDragging) return;

    event.preventDefault();

    const currentX =
      event.pageX -
      slider.offsetLeft;

    const distance =
      (currentX - startX) * 1.3;

    slider.scrollLeft =
      startingScroll - distance;

  }
);


/* =====================================================
   AUTOMATIC SLIDE
   ===================================================== */

let sliderPaused = false;


/* Pause when user touches */

slider.addEventListener(
  "touchstart",
  function () {

    sliderPaused = true;

  },
  {
    passive: true
  }
);


/* Resume after touch */

slider.addEventListener(
  "touchend",
  function () {

    setTimeout(function () {

      sliderPaused = false;

    }, 1500);

  },
  {
    passive: true
  }
);


/* Pause when mouse is over slider */

slider.addEventListener(
  "mouseenter",
  function () {

    sliderPaused = true;

  }
);


slider.addEventListener(
  "mouseleave",
  function () {

    sliderPaused = false;

  }
);


/* Slide every 3.2 seconds */

setInterval(function () {

  if (sliderPaused) return;


  const card =
    slider.querySelector(
      ".restaurant-card"
    );


  if (!card) return;


  const cardWidth =
    card.getBoundingClientRect().width;


  const gap = 18;


  const movement =
    cardWidth + gap;


  /*
    When we reach the end,
    smoothly return to the beginning.
  */

  if (
    slider.scrollLeft +
      slider.clientWidth >=
    slider.scrollWidth - 10
  ) {

    slider.scrollTo({

      left: 0,

      behavior: "smooth"

    });

  } else {

    slider.scrollBy({

      left: movement,

      behavior: "smooth"

    });

  }

}, 3200);


/* =====================================================
   ADD TO CART BUTTON
   ===================================================== */

const addButtons =
  document.querySelectorAll(
    ".add-button"
  );


addButtons.forEach(function (button) {

  button.addEventListener(
    "click",
    function () {

      button.textContent = "✓";

      setTimeout(function () {

        button.textContent = "+";

      }, 1200);

    }
  );

});