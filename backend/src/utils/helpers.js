// This file contains utility functions that can be used throughout the application. 
// It exports helper functions for various tasks.

const generateResponse = (status, message, data = null) => {
    return {
        status,
        message,
        data,
    };
};

const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
    generateResponse,
    isValidObjectId,
};