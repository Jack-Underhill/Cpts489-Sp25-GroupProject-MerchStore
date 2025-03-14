document.addEventListener("DOMContentLoaded", function() {
    const track = document.querySelector(".carousel-items");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const products = document.querySelectorAll(".carousel-card");
    const visibleItems = 2;
    let index = 0;
    
    function getProductWidth() {
        const productWidth = products[0].offsetWidth;
        const gapSize = parseInt(getComputedStyle(track).gap) || 0;

        return productWidth + gapSize;
    }

    function updateCarousel() {
        const productWidth = getProductWidth();
        track.style.transform = `translateX(-${index * (productWidth * visibleItems)}px)`;
    }

    nextBtn.addEventListener("click", () => {
        if (index < Math.ceil(products.length / visibleItems) - 1) {
            index++;
        }
        else {
            index = 0;
        }
        updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
        if (index > 0) {
            index--;
        }
        else {
            index = Math.ceil(products.length / visibleItems) - 1;
        }
        updateCarousel();
    });

    window.addEventListener("resize", () => {
        updateCarousel();
    });
});