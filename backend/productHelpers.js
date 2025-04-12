const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { Product, Attribute, Order, OrderItem, CartItem, User } = require('../lib/associations');

const PLACEHOLDER_IMAGE_PATH = 'public/images/placeholder.png';
const PLACEHOLDER_IMAGE = path.basename(PLACEHOLDER_IMAGE_PATH);

const LEADING_SLASH = /^\/+/;
const WHITESPACE = /\s+/g;

function sanitizeFilename(str) {
    return str.trim().replace(WHITESPACE, '-');
}

function normalizePath(str) {
    return str.replace(LEADING_SLASH, '');
}

function getProductImageUpload() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images/products');
        },
        filename: function(req, file, cb) {
            const originalExt = path.extname(file.originalname);
            const rawName = req.body.name || 'product';
            const safeName = sanitizeFilename(rawName);
            const filename = `${safeName}${originalExt}`;
            cb(null, filename);
        }
    });
    return multer({ storage });
}

function generateSafeFilename(name, file) {
    const ext = file
        ? path.extname(file.originalname)
        : path.extname(PLACEHOLDER_IMAGE)
    const safeName = sanitizeFilename(name);
    return `${safeName}${ext}`;
}

function saveUploadedProductImage(req, newFilename) {
    const oldPath = req.file.path;
    const newPath = path.join(__dirname, '../public/images/products', newFilename);

    fs.renameSync(oldPath, newPath);
    return `/images/products/${newFilename}`;
}

function copyPlaceholderImage(newFilename) {
    const srcPath = path.join(__dirname, '../', PLACEHOLDER_IMAGE_PATH);
    const dstPath = path.join(__dirname, '../public/images/products', newFilename);

    fs.copyFileSync(srcPath, dstPath);
    return `/images/products/${newFilename}`;
}

async function applyAttributesToProduct(product, attributesStr, isEdit = false) {
    if(!attributesStr) return;

    const attrList = attributesStr.split(',').map(attr => attr.trim());

    const foundAttrs = await Promise.all(attrList.map(async (attrName) => {
        const [attribute] = await Attribute.findOrCreate({
            where: { name: attrName, type: 'tag' },
        });

        return attribute;
    }));

    if(isEdit) {
        await product.setAttributes(foundAttrs);
    } else {
        for(const attr of foundAttrs) {
            await product.addAttribute(attr);
        }
    }
}

async function fetchProductWithAttributes(productId) {
    return await Product.findByPk(productId, {
        include: {
            model: Attribute,
            through: { attributes: [] },
        }
    });
}

async function finalizeProductWithAttributes(product, attributes, isEdit = false) {
    await applyAttributesToProduct(product, attributes, isEdit);

    return await fetchProductWithAttributes(product.id);
}

async function prepareAndPersistProduct({ req, name, price, description, existingProduct = null }) {
    const newFilename = generateSafeFilename(req.body.name, req.file);
    let imageUrl;

    if(req.file) { // Image was uploaded
        imageUrl = saveUploadedProductImage(req, newFilename);
    } else if(!existingProduct) { // No image was uploaded
        imageUrl = copyPlaceholderImage(newFilename);
    }

    if(!existingProduct) {
        existingProduct = Product.build();
    }

    existingProduct.name = name;
    existingProduct.price = parseFloat(price);
    existingProduct.description = description;

    // Assigned unless: no image uploaded and product already existed.
    if(imageUrl) {
        existingProduct.imageUrl = imageUrl;
    }

    await existingProduct.save();
    return existingProduct;
}

function deleteImageByPath(relativePath) {
    if(!relativePath) return;

    const cleanPath = normalizePath(relativePath);
    const fullPath = path.resolve(__dirname, '..', 'public', cleanPath);

    if(fs.existsSync(fullPath)) {
        fs.unlink(fullPath, err => {
            if(err) {
                console.warn("Failed to delete image file:", err);
            }
        });
    }
}

function deleteUploadedFile(file) {
    if (file && file.filename) {
        const relativePath = `images/products/${file.filename}`;
        deleteImageByPath(relativePath);
    }
}

function deleteProductImage(imageUrl) {
    deleteImageByPath(imageUrl);
}

async function isProductNameTaken(name, excludeId = null) {
    const whereClause = excludeId
        ? { name, id: { [require('sequelize').Op.ne]: excludeId } }
        : { name };

    const existing = await Product.findOne({ where: whereClause });
    return !!existing;
} 

module.exports = {
    PLACEHOLDER_IMAGE,
    PLACEHOLDER_IMAGE_PATH,
    getProductImageUpload,
    generateSafeFilename,
    saveUploadedProductImage,
    copyPlaceholderImage,
    applyAttributesToProduct,
    fetchProductWithAttributes,
    finalizeProductWithAttributes,
    prepareAndPersistProduct,
    deleteUploadedFile,
    deleteProductImage,
    isProductNameTaken,
}