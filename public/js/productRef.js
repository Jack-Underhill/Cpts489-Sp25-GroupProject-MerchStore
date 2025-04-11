document.addEventListener("DOMContentLoaded", function () {
    const productImages = document.querySelectorAll(".product-ref");

    productImages.forEach(img => {
        const productName = img.src.split('/').pop().replace(/[-_]/g, ' ').replace(/\..+$/, '');

        const button = document.createElement("button");
        button.classList.add("product-card");
        button.setAttribute("onclick", `openProductPage('${productName.replace(/ /g, "-")}')`);

        const title = document.createElement("span");
        title.classList.add("product-title");
        title.textContent = productName;

        button.appendChild(img.cloneNode(true));
        button.appendChild(title);

        img.replaceWith(button);
    });
});

function openProductPage(productName) {
    window.location.href = `/pages/productDetails.html?product=${encodeURIComponent(productName)}`;
}