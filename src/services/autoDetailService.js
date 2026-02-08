// Mock Auto-Detail AI Service
// Simulates AI-powered product detail generation from images

const sampleDescriptions = [
    'Premium quality garment with sophisticated design elements. Perfect for modern professionals seeking timeless elegance.',
    'Contemporary piece featuring clean lines and minimalist aesthetics. Ideal for versatile styling options.',
    'Luxurious item crafted with attention to detail. Combines comfort with refined sophistication.',
    'Modern essential with classic appeal. Designed for those who appreciate quality and style.',
    'Elegant piece that effortlessly transitions from day to night. A must-have for the discerning wardrobe.',
];

const sampleMaterials = [
    '100% Premium Cotton',
    '80% Wool, 20% Polyester',
    '95% Polyester, 5% Elastane',
    '100% Genuine Leather',
    '70% Viscose, 30% Silk',
    '60% Cotton, 40% Linen',
];

const sampleCareInstructions = [
    'Machine wash cold, tumble dry low',
    'Dry clean only',
    'Hand wash cold, lay flat to dry',
    'Machine wash warm, do not bleach',
    'Clean with leather cleaner, condition regularly',
];

/**
 * Simulates AI analysis of product image
 * @param {File} imageFile - The uploaded image file
 * @returns {Promise<Object>} - Generated product details
 */
export const analyzeProductImage = async (imageFile) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate random but consistent details
    const randomIndex = Math.floor(Math.random() * sampleDescriptions.length);

    return {
        success: true,
        data: {
            productName: `${getRandomAdjective()} ${getRandomProductType()}`,
            description: sampleDescriptions[randomIndex],
            material: sampleMaterials[Math.floor(Math.random() * sampleMaterials.length)],
            careInstructions: sampleCareInstructions[Math.floor(Math.random() * sampleCareInstructions.length)],
            suggestedPrice: Math.floor(Math.random() * 200000) + 50000,
            suggestedCategory: getRandomCategory(),
            confidence: (Math.random() * 0.3 + 0.7).toFixed(2), // 70-100% confidence
        },
    };
};

// Helper functions for generating random product details
const adjectives = ['Minimalist', 'Classic', 'Modern', 'Elegant', 'Sophisticated', 'Contemporary', 'Timeless', 'Premium'];
const productTypes = ['Blazer', 'Shirt', 'Sweater', 'Jacket', 'Coat', 'Dress', 'Pants', 'Skirt'];
const categories = ['OUTER', 'TOP', 'BOTTOM', 'ACCESSORIES'];

function getRandomAdjective() {
    return adjectives[Math.floor(Math.random() * adjectives.length)];
}

function getRandomProductType() {
    return productTypes[Math.floor(Math.random() * productTypes.length)];
}

function getRandomCategory() {
    return categories[Math.floor(Math.random() * categories.length)];
}

/**
 * Validates image file
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result
 */
export const validateImageFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Please upload JPG, PNG, or WebP image.' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: 'File size exceeds 5MB limit.' };
    }

    return { valid: true };
};

export default {
    analyzeProductImage,
    validateImageFile,
};
