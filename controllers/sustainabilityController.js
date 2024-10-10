const Product = require('../models/productModel'); // Adjust the path according to your project structure
const Sustainability = require('../models/sustainabilityModel'); // Adjust the path according to your project structure
const Format = require('../models/formatModel');
const { getSustainabilityInfo } = require('../services/geminiService');

const getSustainabilityInfoBySku = async (req, res) => {
    try {
        const { sku } = req.params; // Fetch the product by SKU
        const product = await Product.findOne({ sku });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Fetch all active formats
        const formats = await Format.find({ active: true }).sort({ sequence: 1 });
        if (!formats.length) {
            return res.status(400).json({ message: 'No active formats available.' });
        }

        //console.log('Active Formats', formats);

        // Initialize a sustainabilityMap to hold sustainability information by sequence
        const sustainabilityMap = {};

        for (const format of formats) {
            // Fetch sustainability information for each active format
            let sustainabilityInfo = await Sustainability.findOne({ product: product._id, format: format._id });
            console.log('Fetching format for promptKey:', format.promptKey);
            //console.log(product);
            //console.log(format);

            if (!sustainabilityInfo) {
                try {
                    const newSustainabilityData = await getSustainabilityInfo(product, format.promptKey);

                    sustainabilityInfo = new Sustainability({
                        product: product._id,
                        format: format._id,
                        response: newSustainabilityData.response,
                    });

                    await sustainabilityInfo.save();
                } catch (apiError) {
                    console.error('API Error:', apiError.message); // Detailed logging
                    return res.status(500).json({ message: 'Failed to fetch sustainability information.', error: apiError.message });
                }
            }

            // Store the sustainability info in the sustainabilityMap by sequence
            sustainabilityMap[format.sequence] = {
                response: sustainabilityInfo.response,
                
                //product: product._id,
                createdAt: sustainabilityInfo.createdAt,
            };
        }

        // Prepare the final response using the formats in sequence order
        const sustainabilityInfos = formats.map(format => ({
            sequence: format.sequence,
            data: sustainabilityMap[format.sequence] || null,
        }));

        res.status(200).json({
            status: 'success',
            data: {
                sustainabilityInfos,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

module.exports = { getSustainabilityInfoBySku };
