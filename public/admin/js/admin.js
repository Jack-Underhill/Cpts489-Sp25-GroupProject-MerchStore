document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/products")
        .then(response => response.json())
        .then(products => {
            const total = document.getElementById("total-products");
            const avg = document.getElementById("avg-price");
            const viewed = document.getElementById("most-viewed");
            
            if(total) total.textContent = products.length;
            if(avg) avg.textContent = `$${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}`;
            if(viewed) viewed.textContent = "Coming Soon";
        })
        .catch(error => console.error("Error loading product data:", error));
});