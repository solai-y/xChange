const carousel = document.getElementById("myCarousel");
const images = carousel.getElementsByTagName("img");
let currentIndex = 0;

function showSlide(index) {
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = "none";
    }
    images[index].style.display = "block";
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showSlide(currentIndex);
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    showSlide(currentIndex);
}

// Initially, display the first slide
showSlide(currentIndex);


