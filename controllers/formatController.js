

const format = require('../models/formatModel');
// Create a new format
const createFormat = async (req, res) => {
    try {
        const formatData = req.body;
        const newformatData = new format(formatData);

        // Check if there's already an active format
        const existingActiveFormat = await format.findOne({ active: true });

        if (existingActiveFormat) {
            newformatData.active = false; // Deactivate the new format if there's an existing active one
        } else {
            newformatData.active = true; // Activate the new format if no active format exists
        }

        await newformatData.save();

        res.status(201).json({
            status: 'success',
            data: {
                Format: newformatData,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};
const activateFormat = async (req, res) => {
    try {
        // Find the format to activate by promptKey
        const formatToActivate = await format.findOne({ promptKey: req.params.promptKey });

        if (!formatToActivate) {
            return res.status(404).json({ message: 'Format not found' });
        }

        // Check if the format is already active
        if (formatToActivate.active) {
            return res.status(400).json({ message: 'Format is already active' });
        }

        // Count the number of currently active formats to determine the next sequence
        const activeCount = await format.countDocuments({ active: true });

        // Activate the format and assign the next sequence number
        formatToActivate.active = true;
        formatToActivate.sequence = activeCount + 1; // Assign next sequence
        await formatToActivate.save();

        res.status(200).json({
            status: 'success',
            data: formatToActivate
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
// Controller to deactivate a format and remove its sequence number
const deactivateFormat = async (req, res) => {
    try {
        // Find the format to deactivate by promptKey
        const formatToDeactivate = await format.findOne({ promptKey: req.params.promptKey });

        if (!formatToDeactivate) {
            return res.status(404).json({ message: 'Format not found' });
        }

        // If the format is not active, return an error
        if (!formatToDeactivate.active) {
            return res.status(400).json({ message: 'Format is already inactive' });
        }

        // Deactivate the format and remove its sequence number
        const deactivatedSequence = formatToDeactivate.sequence;
        formatToDeactivate.active = false;
        formatToDeactivate.sequence = null;
        await formatToDeactivate.save();

        // Shift down the sequence numbers of other active formats
        await format.updateMany(
            { active: true, sequence: { $gt: deactivatedSequence } },
            { $inc: { sequence: -1 } }
        );

        res.status(200).json({
            status: 'success',
            message: 'Format deactivated and sequence updated'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
// Controller to fetch active formats in sequence order
const getFormattedData = async (req, res) => {
    try {
        // Fetch all active formats, sorted by sequence
        const activeFormats = await format.find({ active: true }).sort({ sequence: 1 });

        // Prepare the response data based on active formats
        const formattedResponse = activeFormats.map((format) => ({
            type: format.title,
            data: format
        }));

        res.status(200).json({
            status: 'success',
            data: formattedResponse
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
// Get all formats
const getFormats = async (req, res) => {
    try {
        const Formats = await format.find();
        res.status(200).json(Formats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get a format by templateId
const getFormatById = async (req, res) => {
    try {
        const { promptKey } = req.params;
        const Format = await format.findOne({ promptKey });

        if (!Format) {
            return res.status(404).json({ message: 'Format not found' });
        }

        res.status(200).json(Format);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {createFormat,getFormats,getFormatById,activateFormat,deactivateFormat,getFormattedData};




// const getFormattedData = async (req, res) => {
//     try {
//         // Extract the display order and selection preferences from the request body
//         const { formats, order } = req.body;

//         // Default sequence in case none is provided
//         const defaultOrder = ['report', 'score', 'category'];

//         // Set the order for displaying the formats, either provided or default
//         const displayOrder = order && order.length ? order : defaultOrder;

//         // Fetch the active formats from each collection
//         const activeReport = await Report.findOne({ active: true });
//         const activeScore = await Score.findOne({ active: true });
//         const activeCategory = await Category.findOne({ active: true });

//         // Map the active formats
//         const formatMapping = {
//             report: activeReport,
//             score: activeScore,
//             category: activeCategory
//         };

//         // Filter the formats based on the formats array provided
//         const selectedFormats = formats ? formats : ['report', 'score', 'category'];

//         // Prepare the response data based on the provided order and display selection
//         const formattedResponse = displayOrder
//             .filter((format) => selectedFormats.includes(format))
//             .map((format) => ({
//                 type: format,
//                 data: formatMapping[format]
//             }));

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

// module.exports = {
//     getFormattedData
// };


// return {
//     _id: format._id,  // Use _id here
//     data: {
//       promptKey: format.promptKey,
//       title: format.title,
//       description: format.description,
//       promptValue: format.promptValue,
//       active: format.active,
//       sequence: format.sequence,
//       createdAt: format.createdAt
//     }