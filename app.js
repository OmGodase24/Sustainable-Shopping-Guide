const express = require('express');
const morgan = require('morgan');
const productRouter = require('./routes/product-route');
const SustainabilityRouter = require('./routes/sustainability-route');
const FormatRouter = require('./routes/format-route');
const userRouter = require('./routes/user-route');
const corsMiddleware = require('./middleware/corsMiddleware');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(corsMiddleware);

// Routes
app.use('/api/v1.0/products', productRouter);
app.use('/api/v1.0/SSG', SustainabilityRouter); 
app.use('/api/v1.0/formats',FormatRouter);
app.use('/api/v1.0/users',userRouter);

module.exports = app;
































// my project is divided in 3 components 
// product,format(will provide the freedom of how the admin wants to provide prompt instead of static prompt),sustainability

// now product,product is just products present like any other ecommerce site,Here to products we have given a unique id 'SKU' .product will have name,description,materials,categories,tags and materialUsed ,materialUsed isnt gonna be visible to anyone but developer.

// then format,format is nothing but a freedom given to admin so that he/she can create the prompt as per the necessity or their wish ,suppose for example they want sustainabilityreport of product in 30 words,they will create a format of which will have like "Generate a Sustainability report of product in 30 words" ,now this format to will have unique keys named promptKey by which we are activating and deactivating the formats,at a time more than one 
// formats can be active and we will use this active formats in sustainability

// now the sustainability,we are going to first get the product through its sku also we will use the active formats (prompt) which will have what we want about the product ,pass it to gemini (geminiService.js) and get the result needed ,now the things or the factors which we will use like for example:one of active format is "Provide whether this Product is Eccofriendly or Not-Eccfriendly, then gemini will go through all then use the materialsUsed,description,name ,tags,etc given of product and its own intelligence and provide the necessary result as Eccofriendly or not, then i will get result of each active prompt and we will map it together(one below another) as per the sequence number of active format. 
// This is My necessity i think you should have now understood now ,My current code tell me necessary changes to achieve the above:
// app.js:
// const express = require('express');
// const morgan = require('morgan');
// const productRouter = require('./routes/product-route');
// const SustainabilityRouter = require('./routes/sustainability-route');
// const FormatRouter = require('./routes/format-route');
// const corsMiddleware = require('./middleware/corsMiddleware');
// const app = express();
// // Middleware
// app.use(morgan('dev'));
// app.use(express.json());
// app.use(corsMiddleware);
// // Routes
// app.use('/api/v1.0/products', productRouter);
// app.use('/api/v1.0/SSG', SustainabilityRouter); 
// app.use('/api/v1.0/formats',FormatRouter);
// module.exports = app;
// sustainability-route.js:
// const express = require('express');
// const {getSustainabilityInfoBySku} = require('../controllers/sustainabilityController');
// const router = express.Router();

// // Updated route to fetch sustainability info by SKU without promptKey
// router.get('/sustainability/:sku', getSustainabilityInfoBySku);
// module.exports = router;
// product-route.js:
// const express = require('express');
// const {createProduct,getProducts,getProductBySku,getProductBySkuMa,updateProduct,deleteProduct} = require('../controllers/productController');
// const router = express.Router();

// router.post('/createproduct', createProduct);
// router.get('/', getProducts);
// router.get('/:sku', getProductBySku);
// router.get('MaUs/:sku', getProductBySkuMa);
// router.patch('/:sku', updateProduct);
// router.delete('/:sku', deleteProduct);
// module.exports = router;

// format-route.js:
// const express = require('express');
// const { createFormat, getFormats,getFormatById, getFormattedData, activateFormat, deactivateFormat } = require('../controllers/formatController');
// const router = express.Router();

// router.post('/', createFormat);
// router.get('/', getFormats);
// router.get('/:promptKey', getFormatById);
// router.patch('/activate/:promptKey', activateFormat);
// router.post('/combined', getFormattedData);
// router.patch('/deactivate/:promptKey', deactivateFormat);
// module.exports = router;

// sustainabilityModel.js:
// const mongoose = require('mongoose');
// const sustainabilitySchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true,
//   },
//   format: { // New field to associate with the format
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'format',
//     required: true, // Ensure each sustainability entry is tied to a format
//   },
//   response: {
//     type: String,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Create a connection specifically for the Sustainability database
// const sustainabilityConnection = mongoose.createConnection(process.env.SUSTAINABILITY_DATABASE_LOCAL || "mongodb://127.0.0.1:27017/SustainabilityDB");
// const Sustainability = sustainabilityConnection.model('Sustainability', sustainabilitySchema);
// module.exports = Sustainability;
// productModel.js:
// const mongoose = require('mongoose');
// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   sku: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   material: {
//     type: [String],
//     required: true,
//   },
//   categories: {
//     type: [String],
//   },
//   tags: {
//     type: [String],
//   },
//   materialsUsed: [  // New field for materials used and their quantities
//     {
//       materialName: { //Copper ,
//         type: String,
//         required: true,
//       },
//       quantity: {
//         type: String,  // Storing as string like "200g"
//         required: true,
//       },
//     },
//   ],
//   sustainabilityInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'Sustainability' },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// }, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// // Exclude materialsUsed from being displayed when fetching data
// productSchema.path('materialsUsed').select(false);
// const Product = mongoose.model('Product', productSchema);
// module.exports = Product;
// formatModel.js:
// const mongoose = require('mongoose');
// const formatSchema = new mongoose.Schema({
//     promptKey: { type: String, required: true, unique: true, sparse: true },
//     title: { type: String, required: true, unique: true },
//     description: { type: String, required: true },
//     promptValue: { type: String, required: true },
//     active: { type: Boolean, default: false },
//     sequence: { type: Number, default: null }, // Sequence starts as null
//     createdAt: { type: Date, default: Date.now }
// });

// const formatConnection = mongoose.createConnection(process.env.SUSTAINABILITY_DATABASE_LOCAL || "mongodb://127.0.0.1:27017/SustainabilityDB");
// const formatModel = formatConnection.model('format', formatSchema);
// module.exports = formatModel;
// sustainabilityController.js:
// const Product = require('../models/productModel'); // Adjust the path according to your project structure
// const Sustainability = require('../models/sustainabilityModel'); // Adjust the path according to your project structure
// const Format = require('../models/formatModel');
// const { getSustainabilityInfo } = require('../services/geminiService');

// const getSustainabilityInfoBySku = async (req, res) => {
//     try {
//         const { sku } = req.params;// Fetch the product by SKU
//         const product = await Product.findOne({ sku });
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         // Fetch all active formats
//         const formats = await Format.find({ active: true });
//         if (!formats.length) {
//             return res.status(400).json({ message: 'No active formats available.' });
//         }
//         // Initialize an array to hold sustainability information
//         const sustainabilityInfos = [];
//         for (const format of formats) {
//             // Fetch sustainability information for each active format
//             let sustainabilityInfo = await Sustainability.findOne({ product: product._id, format: format._id });

//             if (!sustainabilityInfo) {
//                 try {
//                     const newSustainabilityData = await getSustainabilityInfo(product, format.promptKey);
//                     sustainabilityInfo = new Sustainability({
//                         product: product._id,
//                         format: format._id,
//                         response: newSustainabilityData.response,
//                     });

//                     await sustainabilityInfo.save();
//                 } catch (apiError) {
//                     console.error('API Error:', apiError.message); // Detailed logging
//                     return res.status(500).json({ message: 'Failed to fetch sustainability information.', error: apiError.message });
//                 }
//             }
//             sustainabilityInfos.push(sustainabilityInfo);
//         }
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 sustainabilityInfos,
//             },
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: error.message,
//         });
//     }
// };
// module.exports = {getSustainabilityInfoBySku};
// productController.js:
// const Product = require('../models/productModel');
// // Create a new product and its sustainability info
// const createProduct = async (req, res) => {
//   try {
//     const productData = req.body;
//     const newProduct = new Product(productData);
//     await newProduct.save();

//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json({
//       status: 'success',
//       results: products.length,
//       data: {
//         products,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: error.message,
//     });
//   }
// };
// const getProductBySku = async (req, res) => {
//   try {
//     const { sku } = req.params;
//     const product = await Product.findOne({ sku });

//     if (!product) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Product not found',
//       });
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         product,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: error.message,
//     });
//   }
// };
//   try {
//     const { sku } = req.params;
//     const updatedProductData = req.body;

//     const updatedProduct = await Product.findOneAndUpdate(
//       { sku },
//       updatedProductData,
//       { new: true } // Return the updated document
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//         res.status(200).json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const deleteProduct = async (req, res) => {
//   try {
//     const { sku } = req.params;

//     const product = await Product.findOneAndDelete({ sku });

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     await Sustainability.deleteOne({ product: product._id });

//     res.status(204).json({ status: 'success', data: null });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const getProductBySkuMa = async (req, res) => {
//   try {
//     const { sku } = req.params;
    
//     // Retrieve the product with the hidden field explicitly included
//     const product = await Product.findOne({ sku }).select('+materialsUsed');

//     if (!product) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Product not found',
//       });
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         product,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: error.message,
//     });
//   }
// };
// module.exports = {createProduct,getProducts,getProductBySku,getProductBySkuMa,updateProduct,deleteProduct};
// formatController.js:
// const format = require('../models/formatModel');
// // Create a new format
// const createFormat = async (req, res) => {
//     try {
//         const formatData = req.body;
//         const newformatData = new format(formatData);

//         // Check if there's already an active format
//         const existingActiveFormat = await format.findOne({ active: true });

//         if (existingActiveFormat) {
//             newformatData.active = false; // Deactivate the new format if there's an existing active one
//         } else {
//             newformatData.active = true; // Activate the new format if no active format exists
//         }

//         await newformatData.save();

//         res.status(201).json({
//             status: 'success',
//             data: {
//                 Format: newformatData,
//             },
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: error.message,
//         });
//     }
// };
// const activateFormat = async (req, res) => {
//     try {
//         // Find the format to activate by promptKey
//         const formatToActivate = await format.findOne({ promptKey: req.params.promptKey });

//         if (!formatToActivate) {
//             return res.status(404).json({ message: 'Format not found' });
//         }

//         // Check if the format is already active
//         if (formatToActivate.active) {
//             return res.status(400).json({ message: 'Format is already active' });
//         }

//         // Count the number of currently active formats to determine the next sequence
//         const activeCount = await format.countDocuments({ active: true });

//         // Activate the format and assign the next sequence number
//         formatToActivate.active = true;
//         formatToActivate.sequence = activeCount + 1; // Assign next sequence
//         await formatToActivate.save();

//         res.status(200).json({
//             status: 'success',
//             data: formatToActivate
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: error.message
//         });
//     }
// };
// // Controller to deactivate a format and remove its sequence number
// const deactivateFormat = async (req, res) => {
//     try {
//         // Find the format to deactivate by promptKey
//         const formatToDeactivate = await format.findOne({ promptKey: req.params.promptKey });

//         if (!formatToDeactivate) {
//             return res.status(404).json({ message: 'Format not found' });
//         }

//         // If the format is not active, return an error
//         if (!formatToDeactivate.active) {
//             return res.status(400).json({ message: 'Format is already inactive' });
//         }

//         // Deactivate the format and remove its sequence number
//         const deactivatedSequence = formatToDeactivate.sequence;
//         formatToDeactivate.active = false;
//         formatToDeactivate.sequence = null;
//         await formatToDeactivate.save();

//         // Shift down the sequence numbers of other active formats
//         await format.updateMany(
//             { active: true, sequence: { $gt: deactivatedSequence } },
//             { $inc: { sequence: -1 } }
//         );

//         res.status(200).json({
//             status: 'success',
//             message: 'Format deactivated and sequence updated'
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: error.message
//         });
//     }
// };
// // Controller to fetch active formats in sequence order
// const getFormattedData = async (req, res) => {
//     try {
//         // Fetch all active formats, sorted by sequence
//         const activeFormats = await format.find({ active: true }).sort({ sequence: 1 });

//         // Prepare the response data based on active formats
//         const formattedResponse = activeFormats.map((format) => ({
//             type: format.title,
//             data: format
//         }));

//         res.status(200).json({
//             status: 'success',
//             data: formattedResponse
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: error.message
//         });
//     }
// };
// // Get all formats
// const getFormats = async (req, res) => {
//     try {
//         const Formats = await format.find();
//         res.status(200).json(Formats);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// // Get a format by templateId
// const getFormatById = async (req, res) => {
//     try {
//         const { promptKey } = req.params;
//         const Format = await format.findOne({ promptKey });

//         if (!Format) {
//             return res.status(404).json({ message: 'Format not found' });
//         }

//         res.status(200).json(Format);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// module.exports = {createFormat,getFormats,getFormatById,activateFormat,deactivateFormat,getFormattedData};
// geminiService.js:
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const Sentiment = require('sentiment'); // Sentiment Analysis package
// require('dotenv').config();
// const Format = require('../models/formatModel');
// const Product = require('../models/productModel'); // Assuming there's a Product model

// const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDZbCiEk0HCdcxosgIsGkGhfkkgEzZtBYU";
// const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const sentiment = new Sentiment(); // Sentiment analysis instance

// const getSustainabilityInfo = async (product, templateId) => {
//     try {
//         const format = await Format.findOne({ templateId });

//         if (!format) {
//             throw new Error('Format not found');
//         }

//         const { name: productName, material, description, categories, tags } = product;
//         const formatPrompts = format.prompts;

//         // Include additional factors (description, categories, tags) in the prompt for more accuracy
//         const fullContext = `Product Name: ${productName}, Material: ${material}, Description: ${description}, Categories: ${categories.join(', ')}, Tags: ${tags.join(', ')}`;

//         // Generate a concise sustainability report using the full context
//         const reportResponse = await model.generateContent(
//             formatPrompts.report.replace('{{name}}', productName).replace('{{material}}', material)
//             + ` Additional Context: ${fullContext}`
//         );
//         let sustainabilityReport = reportResponse.response.text().trim();

//         // Convert the report to bullet points if necessary
//         const reportLines = sustainabilityReport.split('\n').filter(line => line.trim() !== '');
//         sustainabilityReport = reportLines.slice(0, 10).map(line => `• ${line.trim()}`).join('\n');

//         // Return the sustainability report without the removed properties
//         return {
//             sustainabilityReport
//         };
//     } catch (error) {
//         console.error('Error fetching sustainability info:', error.message);
//         throw new Error('Failed to fetch sustainability information.');
//     }
// };
// module.exports = { getSustainabilityInfo };
