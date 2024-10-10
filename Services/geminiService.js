const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: './config.env' }); // Ensure correct path to your .env file
const Format = require('../models/formatModel');
const Product = require('../models/productModel'); // Assuming there's a Product model

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_VERSION = process.env.GEMINI_MODEL;

console.log("Api key:", API_KEY);
console.log("Model Version:", MODEL_VERSION);


const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_VERSION });

const aggregateBomItems = (bomItems) => {
  return bomItems.reduce((acc, item) => {
    // Check if the material already exists in the accumulator
    if (!acc[item.material]) {
      // If not, create a new entry for the material
      acc[item.material] = {
        totalWeight: 0,
        // totalCost: 0,
      };
    }
    // Aggregate the total weight and cost for the material
    acc[item.material].totalWeight += item.weight;
    // acc[item.material].totalCost += item.totalCost;

    return acc;
  }, {});
};

const getSustainabilityInfo = async (product, promptKey) => {
  try {
    // Retrieve the format for the given promptKey
    console.log('getSustainabilityInfo called');
    const format = await Format.findOne({ promptKey });

    if (!format || !format.promptValue) {
      throw new Error('Format is not defined');
    }

    const { name: productName, material, description, categories, tags, materialSourcing, bomItems } = product;
    console.log(product);
    const formatPrompts = format.promptValue;

    // Update materialSourcingText to handle the object structure correctly
    let materialSourcingText = 'No materials information available.';
    if (materialSourcing && typeof materialSourcing === 'object') {
      // Base material information
      materialSourcingText = `${materialSourcing.baseMaterial} (Source: ${materialSourcing.source}, Recycled Content: ${materialSourcing.recycledContent}, Toxicity: ${materialSourcing.materialToxicity})`;

      // Handle sourcing details
      if (materialSourcing.sourcingDetails && typeof materialSourcing.sourcingDetails === 'object') {
        const sourcingDetailEntries = Array.from(materialSourcing.sourcingDetails.entries()); // Convert Map to Array
        if (sourcingDetailEntries.length > 0) {
          const sourcingDetailsText = sourcingDetailEntries.map(([key, value]) => {
            return `Supplier: ${value.supplier}, Location: ${value.location}, Environmental Impact: ${value.environmentalImpact}, Certifications: ${value.certifications.join(', ')}`;
          }).join('; ');
          materialSourcingText += `; Sourcing Details: ${sourcingDetailsText}`;
        }
      }
    }
    console.log('materialS:', materialSourcingText);

    // Process BOM items for additional context
    let bomItemsText = 'No BOM items available.';
    if (Array.isArray(bomItems) && bomItems.length > 0) {
      // Aggregate BOM items by material
      const aggregatedBomItems = aggregateBomItems(bomItems);
      // Format the aggregated results
      bomItemsText = Object.entries(aggregatedBomItems).map(([material, { totalWeight}]) => {
        return `${material}: Total Weight: ${totalWeight.toFixed(2)} kg`;
      }).join('; ');
    }
    console.log('bomT:', bomItemsText);

    const fullContext = `Product Name: ${productName}, Material: ${material}, Description: ${description}, Categories: ${categories.join(', ')}, Tags: ${tags.join(', ')}, Material Sourcing: ${materialSourcingText}, BOM Items: ${bomItemsText}`;

    const response = await model.generateContent(
      formatPrompts.replace('{{name}}', productName)
      + ` Additional Context: ${fullContext}`
    );

    console.log('Generated Response:', JSON.stringify(response, null, 2));

    if (response && response.response && Array.isArray(response.response.candidates) && response.response.candidates.length > 0) {
      const sustainabilityReport = response.response.candidates[0].content.parts[0].text;

      if (!sustainabilityReport) {
        throw new Error('Sustainability report text is undefined.');
      }

      const reportLines = sustainabilityReport.split('\n').filter(line => line.trim() !== '');
      const bulletPoints = reportLines.slice(0, 10).map(line => `• ${line.trim()}`).join('\n');

      return {
        response: bulletPoints // Returning the formatted bullet points
      };
    } else {
      console.error('Unexpected response format:', response);
      throw new Error('Invalid response format from AI model.');
    }
  } catch (error) {
    console.error('Error fetching sustainability info:', error.message);
    throw new Error('Failed to fetch sustainability information.');
  }
};


module.exports = { getSustainabilityInfo };
