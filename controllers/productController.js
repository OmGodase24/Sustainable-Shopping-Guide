
const Product = require('../models/productModel'); // Adjust the path according to your project structure
// const Sustainability = require('../models/sustainabilityModel'); // Adjust the path according to your project structure
// const Format = require('../models/formatModel');
// const { getSustainabilityInfo } = require('../services/geminiService');

// Create a new product and its sustainability info
const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get a product by SKU
const getProductBySku = async (req, res) => {
  try {
    const { sku } = req.params;
    const product = await Product.findOne({ sku });

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// // Get sustainability info by SKU, regenerate if deleted

// const getSustainabilityInfoBySku = async (req, res) => {
//   try {
//     const { sku, templateId } = req.params;

//     // Fetch the product by SKU
//     const product = await Product.findOne({ sku });
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Fetch the format by templateId
//     const format = await Format.findOne({ templateId: templateId });
//     console.log('Fetched Format:', format);

//     // Check if the format exists and is active
//     if (!format || !format.active) {
//       return res.status(400).json({ message: 'The requested format is either not found or not active.' });
//     }

//     // Fetch sustainability information
//     let sustainabilityInfo = await Sustainability.findOne({ product: product._id, format: format._id });

//     if (!sustainabilityInfo) {
//       try {
//         const newSustainabilityData = await getSustainabilityInfo(product, templateId);

//         sustainabilityInfo = new Sustainability({
//           product: product._id,
//           format: format._id,
//           sustainabilityReport: newSustainabilityData.sustainabilityReport,
//           sustainabilityCategory: newSustainabilityData.sustainabilityCategory,
//           sustainabilityScore: newSustainabilityData.sustainabilityScore,
//         });

//         await sustainabilityInfo.save();
//       } catch (apiError) {
//         console.error('API Error:', apiError.message); // Detailed logging
//         return res.status(500).json({ message: 'Failed to fetch sustainability information.', error: apiError.message });
//       }
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         sustainabilityInfo,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: error.message,
//     });
//   }
// };




// Update a product by SKU and its sustainability info if necessary
const updateProduct = async (req, res) => {
  try {
    const { sku } = req.params;
    const updatedProductData = req.body;

    const updatedProduct = await Product.findOneAndUpdate(
      { sku },
      updatedProductData,
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update sustainability info if necessary
    // const sustainabilityInfo = await getSustainabilityInfo(updatedProduct);

    // let sustainability = await Sustainability.findOneAndUpdate(
    //   { product: updatedProduct._id },
    //   {
    //     sustainabilityReport: sustainabilityInfo.sustainabilityReport,
    //     sustainabilityCategory: sustainabilityInfo.sustainabilityCategory,
    //     sustainabilityScore: sustainabilityInfo.sustainabilityScore,
    //   },
    //   { new: true } // Return the updated document
    // );

    // if (!sustainability) {
    //   // If no sustainability info found, create a new one
    //   sustainability = new Sustainability({
    //     product: updatedProduct._id,
    //     sustainabilityReport: sustainabilityInfo.sustainabilityReport,
    //     sustainabilityCategory: sustainabilityInfo.sustainabilityCategory,
    //     sustainabilityScore: sustainabilityInfo.sustainabilityScore,
    //   });
    //   await sustainability.save();
    // }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product by SKU and its sustainability info
const deleteProduct = async (req, res) => {
  try {
    const { sku } = req.params;

    const product = await Product.findOneAndDelete({ sku });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Sustainability.deleteOne({ product: product._id });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {createProduct,getProducts,getProductBySku,updateProduct,deleteProduct};
