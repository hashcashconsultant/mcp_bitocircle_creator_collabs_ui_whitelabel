import React, { createContext, useContext, useState } from 'react';

// Create the context
const BrandContext = createContext();

// Custom hook to use the brand context
export const useBrand = () => {
    const context = useContext(BrandContext);
    if (!context) {
        throw new Error('useBrand must be used within a BrandProvider');
    }
    return context;
};

// Brand Provider Component
export const BrandProvider = ({ children }) => {
    const [brandData, setBrandData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Save brand data to context only
    const saveBrandData = (data) => {
        if (!data?.brand) {
            console.error('Invalid brand data');
            return;
        }

        const brand = data.brand;

        // Update context state
        setBrandData(brand);

        console.log('Brand data saved to context:', brand);
    };

    // Clear brand data from context
    const clearBrandData = () => {
        setBrandData(null);
        console.log('Brand data cleared');
    };

    // Get brand ID helper
    const getBrandId = () => {
        return brandData?.brandId;
    };

    // Check if brand is setup
    const isBrandSetup = () => {
        return !!brandData;
    };

    // Set loading state
    const setLoadingState = (isLoading) => {
        setLoading(isLoading);
    };

    const value = {
        brandData,
        loading,
        saveBrandData,
        clearBrandData,
        getBrandId,
        isBrandSetup,
        setLoadingState,
    };

    return (
        <BrandContext.Provider value={value}>
            {children}
        </BrandContext.Provider>
    );
};

export default BrandContext;