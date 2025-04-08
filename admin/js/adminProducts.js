document.addEventListener("DOMContentLoaded", function () 
{
    const CLASS_HIDDEN = "hidden";
    const CLASS_SUCCESS = "success";
    const messageBox = document.getElementById("message");

    function showMessage(text, type = CLASS_SUCCESS)
    {
        messageBox.textContent = text;
        messageBox.className = type;
        messageBox.classList.remove(CLASS_HIDDEN);

        setTimeout(() => {
            messageBox.classList.add(CLASS_HIDDEN);
        }, 2500);
    }

    const productList = document.getElementById("product-list");
    const addProductBtn = document.getElementById("add-product-btn");
    const modal = document.getElementById("product-modal");
    const productForm = document.getElementById("product-form");
    const formTitle = document.getElementById("form-title");
    const nameInput = document.getElementById("product-name");
    const priceInput = document.getElementById("product-price");
    const descInput = document.getElementById("product-description");
    const cancelBtn = document.getElementById("cancel-btn");

    let editIndex = null;
    let products = [];

    // Load product list
    fetch("../js/products.json")
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProductTable();
        })
        .catch(error => console.error("Error loading product data:", error));

        // Add Product Button
        addProductBtn.addEventListener("click", () => {
            editIndex = null;
            openProductForm();
    });

    // Open Form
    function openProductForm(product = null) 
    {
        formTitle.textContent = product ? "Edit Product" : "Add Product";
        nameInput.value = product ? product.name : "";
        priceInput.value = product ? product.price : "";
        descInput.value = product ? product.description : "";

        modal.classList.remove(CLASS_HIDDEN);
    }

    // Render Products into Table
    function renderProductTable() {
        productList.innerHTML = "";
        products.forEach((product, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            productList.appendChild(row);
        });
    
        // Re-attach Edit buttons after rebuild
        const editButtons = document.querySelectorAll(".edit-btn");
        editButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                editIndex = index;
                openProductForm(products[index]);
            });
        });

        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                if(confirm(`Are you sure you want to delete "${products[index].name}"?`)) {
                    products.splice(index, 1);
                    renderProductTable();
                    showMessage("Product deleted successfully!");
                }
            });
        });
    }    

    // Submit Form
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = nameInput.value;
        const price = parseFloat(priceInput.value);
        const description = descInput.value;

        if (editIndex === null) 
        {
            const newProduct = { name, price, description };
            products.push(newProduct);
            console.log("Adding Product:", newProduct);
            showMessage("Product added successfully!");
        } 
        else 
        {
            console.log(`Editing product at index ${editIndex}`);
            products[editIndex].name = name;
            products[editIndex].price = price;
            products[editIndex].description = description;
            console.log("Updated Product:", products[editIndex]);
            showMessage("Product updated successfully!");
        }

        renderProductTable();
        modal.classList.add(CLASS_HIDDEN);
        productForm.reset();
    });

    // Cancel Button
    cancelBtn.addEventListener("click", () => {
        modal.classList.add(CLASS_HIDDEN);
        productForm.reset();
    });
});
