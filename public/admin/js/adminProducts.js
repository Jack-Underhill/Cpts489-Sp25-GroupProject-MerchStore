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
    const attrInput = document.getElementById("product-attributes");
    const imagePreview = document.getElementById("current-image-preview");
    const cancelBtn = document.getElementById("cancel-btn");

    let editIndex = null;
    let products = [];

    
    // Load product list
    fetch("/api/products")
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
        attrInput.value = product && product.attributes ? product.attributes.map(a => a.name).join(", ") : "";
        if(product && product.imageUrl) {
            imagePreview.innerHTML = `<small>Current image:</small><br><img src="${product.imageUrl}" alt="Current Image" height="80px">`;
        } else {
            imagePreview.innerHTML = "";
        }
        
        modal.classList.remove(CLASS_HIDDEN);
    }

    // Render Products into Table
    function renderProductTable() {
        productList.innerHTML = "";
        products.forEach((product, index) => {
            console.log(`Product: ${product.name}`);
            console.log('Attributes:', product.attributes);
            console.log('Object:', product);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <button class="edit-btn" data-id="${product.id}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            productList.appendChild(row);
        });
    
        // Re-attach Edit buttons after rebuild
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const product = products.find(p => p.id == id);
                editIndex = products.findIndex(p => p.id == id);
                if(!product) return;

                document.getElementById('form-title').textContent = "Edit Product";
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-description').value = product.description;
                // document.getElementById('product-attributes').value = (product.attributes || []).map(a => a.name).join(', ');
                document.getElementById('product-attributes').value = (product.attributes || []).join(', ');
                
                imagePreview.innerHTML = `<p>Current image:</p><img src="${product.imageUrl}" alt="${product.name}" height="80px">`;
                
                document.getElementById('product-form').dataset.editing = id;
                modal.classList.remove('hidden');
            });
        });

        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                const product = products[index];

                if(confirm(`Are you sure you want to delete "${product.name}"?`)) {
                    fetch(`/api/products/${product.id}`, {
                        method: "DELETE"
                    })
                    .then(res => res.json())
                    .then(data => {
                        if(data.success) {
                            products.splice(index, 1);
                            renderProductTable();
                            showMessage("Product deleted successfully!");
                        } else {
                            showMessage("Failed to delete product", "error"); 
                        }
                    })
                    .catch(err => {
                        console.error("Error deleting product:", err);
                        showMessage("Error deleting product", "errer");
                    });
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
        const attributes = attrInput.value;
        const imageFile = document.getElementById("product-image").files[0];

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("attributes", attributes);

        const isEditing = editIndex !== null;
        const currentProduct = isEditing ? products[editIndex] : null;

        if(isEditing) {
            formData.append("id", currentProduct.id);
            
            if(imageFile) {
                formData.append("image", imageFile);
            }
            
            fetch("/api/products", {
                method: "PUT",
                body: formData
            })
            .then(() => {
                if(imageFile) {
                    location.reload();
                    return;
                }
                return fetch("/api/products");
            })
            .then(res => res?.json?.())
            .then(data => {
                if(!data) return;
                products = data;
                renderProductTable();
                showMessage("Product updated successfully!");
            })
            .catch(err => {
                console.error("Error updating product:", err);
                showMessage("Error updating product", "errer");
            });
        } 
        else {
            if(imageFile) {
                formData.append("image", imageFile);
            } else {
                formData.append("placeholder", "true");
            }

            fetch("/api/products", {
                method: "POST",
                body: formData
            })
            .then(() => {
                return fetch("/api/products");
            })
            .then(res => res.json())
            .then(data => {
                products = data;
                renderProductTable();
                showMessage("Product added successfully!");
            })
            .catch(err => {
                console.error("Error adding product:", err);
                showMessage("Error adding product", "errer");
            });
        }
        
        modal.classList.add(CLASS_HIDDEN);
        productForm.reset();
    });

    // Cancel Button
    cancelBtn.addEventListener("click", () => {
        modal.classList.add(CLASS_HIDDEN);
        productForm.reset();
    });
});
