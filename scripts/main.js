const app = {
  init: function () {
    console.log("Hello world :)");
  },
};

const modalImg = document.getElementById("modal-image");

function showNextOrPrevImg(direction) {
  const visibleImages = Array.from(
    document.querySelectorAll(".post-body-img-l, .post-body-img, .gallery-img"),
  );
  const currentSrc = modalImg.src;
  let currentIndex = visibleImages.findIndex((img) => img.src === currentSrc);
  let nextIndex = currentIndex + direction;
  if (direction === 1 && nextIndex >= visibleImages.length) {
    nextIndex = 0;
  } else if (direction === -1 && nextIndex === -1) {
    nextIndex = visibleImages.length - 1;
  }
  showImage(visibleImages[nextIndex]);
}

function showImage(image) {
  console.log("Clicked show image!");
  console.log(image);

  modalImg.style.display = "none";
  modalImg.src = image.src;

  modalImg.onload = function () {
    modalImg.style.display = "block";
  };
}

app.init();
