document.addEventListener("DOMContentLoaded", function () {
    fetch("../js/products.json")
        .then(response => response.json())
        .then(products => {
            document.getElementById("total-products").textContent = products.length;
            document.getElementById("avg-price").textContent = `$${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}`;
            document.getElementById("most-viewed").textContent = "Coming Soon";
        })
        .catch(error => console.error("Error loading product data:", error));
});