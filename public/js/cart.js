import { renderCartItem } from './createCartItem.js';

document.addEventListener("DOMContentLoaded", async function () {
    const cartSection = document.querySelector(".cart-section");
    const cartList = document.createElement("div");

    try {
        // Check if user logged in before loading cart
        const authCheck = await fetch("/api/current-user");
        const authData = await authCheck.json();

        if (!authData.loggedIn) {
            cartSection.innerHTML = `<p>Please <a href="/pages/login.html">log in</a> to view your cart.</p>`;
            return;
        }

        const res = await fetch("/api/cart");
        const cartItems = await res.json();

        cartList.innerHTML = "";

        let subtotal = 0;
        cartItems.forEach((item, index) => {
            subtotal += item.product.price * item.quantity;
            const itemElement = renderCartItem(item, index);
            cartList.appendChild(itemElement);
        });

        cartSection.insertBefore(cartList, document.querySelector(".cart-buttons"));

        // Update summary values
        const summary = document.querySelector(".summary");
        summary.innerHTML = `
            <h3>Summary</h3>
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>Shipping: $${(subtotal > 0 ? 5 : 0).toFixed(2)}</p>
            <p>Taxes: $${(subtotal * 0.1).toFixed(2)}</p>
            <p>Total: $${(subtotal * 1.1 + (subtotal > 0 ? 5 : 0)).toFixed(2)}</p>
        `;
    } catch (err) {
        console.error("Failed to load cart:", err);
        cartSection.innerHTML = `<p>Error loading cart. Try again later.</p>`;
    }
});
