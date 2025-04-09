document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const productName = params.get("product");

    if(productName) {
        const formattedName = productName.replace(/-/g, ' ');

        document.getElementById("product-title").textContent = formattedName;
        document.getElementById("main-image").src = `/public/images/products/${productName}.png`;
    }
});