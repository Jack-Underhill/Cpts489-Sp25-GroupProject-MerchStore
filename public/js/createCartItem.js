export function renderCartItem(item, index) {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
        <img class="item-img" src="${item.product.imageUrl}" alt="${item.product.name}">
        <div class="item-details">
            <p>${item.product.name}</p>
            <label for="quantity${index}">Quantity:</label>
            <select id="quantity${index}" data-product-id="${item.product.id}">
                ${[1, 2, 3, 4, 5].map(qty =>
                    `<option value="${qty}" ${qty === item.quantity ? 'selected' : ''}>${qty} pcs</option>`
                ).join('')}
            </select>
        </div>
    `;

    return cartItem;
}