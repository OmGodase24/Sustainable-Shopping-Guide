const mongoose = require('mongoose');

// Define the schema for sourcing details of materials
const sourcingDetailSchema = new mongoose.Schema({
    supplier: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    certifications: [
        {
            type: String // Array to hold certifications related to the sourcing
        }
    ],
    environmentalImpact: {
        type: String,
        required: true
    }
});

// Define the schema for material sourcing
const materialSourcingSchema = new mongoose.Schema({
    baseMaterial: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    recycledContent: {
        type: String,
        required: true
    },
    materialToxicity: {
        type: String,
        required: true
    },
    sourcingDetails: {
        type: Map,
        of: sourcingDetailSchema // Use Map to allow any material name
    }
});

// Define the schema for BOM (Bill of Materials) items
const bomItemSchema = new mongoose.Schema({
    itemNo: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitCost: {
        type: Number,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    weight: {
        type: Number, // Weight per item in kg (ensure consistent unit across products)
        required: true
    }
});

// Define the schema for general products
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // General product name
    },
    description: {
        type: String,
        required: true // Product description
    },
    price: {
        type: Number,
        required: true // Product price
    },
    sku: {
        type: String,
        required: true,
        unique: true // SKU should be unique for each product
    },
    categories: [
        {
            type: String
        }
    ],
    tags: [
        {
            type: String
        }
    ],
    bomItems: {
        type: [bomItemSchema],
        default: [],
        //select: false // Exclude by default when querying products
    },
    totalEstimatedCost: {
        type: Number,
        default: 0,
        //select: false // Exclude by default when querying products
    },
    totalWeight: {
        type: Number,
        default: 0,
        //select: false // Exclude by default when querying products
    },
    materialSourcing: materialSourcingSchema // Add the materialSourcing field with nested sourcingDetails
});

// Method to calculate total cost and total weight of the BOM items
productSchema.methods.calculateTotals = function () {
    this.totalEstimatedCost = this.bomItems.reduce((sum, item) => sum + item.totalCost, 0);
    this.totalWeight = this.bomItems.reduce((sum, item) => sum + item.weight, 0);
};

// Pre-save middleware to automatically calculate totals before saving
productSchema.pre('save', function (next) {
    this.calculateTotals();
    this.updatedAt = Date.now(); // Update the `updatedAt` field on every save
    next();
});

// Pre-update middleware to recalculate totals on update
productSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.bomItems) {
        const totalEstimatedCost = update.bomItems.reduce((sum, item) => sum + item.totalCost, 0);
        const totalWeight = update.bomItems.reduce((sum, item) => sum + item.weight, 0);
        this.setUpdate({
            ...update,
            totalEstimatedCost,
            totalWeight,
            updatedAt: Date.now()
        });
    }
    next();
});

// Remove certain fields when converting documents to JSON or objects
productSchema.set('toJSON', {
    transform: (doc, ret) => {
        return ret;
    }
});

productSchema.set('toObject', {
    transform: (doc, ret) => {
        return ret;
    }
});

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
