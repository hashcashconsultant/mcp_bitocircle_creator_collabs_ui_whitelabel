import apiClient from './apiClient';
import Cookies from 'js-cookie';
import { signInUrl } from '../config/whitelabel';


// API base URL
const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';
export const MAX_OFFER_PLACE_LIMIT = 6;
// Sign-in page of the community app on this same domain (see src/config/whitelabel.js).
export const LOGIN_URL = signInUrl();

/**
 * Update campaign status
 * @param {number} campaignId - The campaign ID
 * @param {number} brandId - The brand ID
 * @param {string} status - The new status (e.g., 'ACTIVE', 'PAUSED', 'CANCELLED', 'ENDED', 'DRAFT')
 * @returns {Promise<Object>} API response
 * @throws {Error} If the API call fails
 */
export const updateCampaignStatus = async (campaignId, brandId, status) => {
    try {
        const payload = {
            campaignId,
            brandId,
            status,
        };

        console.log('Updating campaign status:', payload);

        const response = await apiClient.post(
            `${API_BASE_URL}/brand/update_campaign_status`,
            payload
        );

        console.log('Update campaign status response:', response.data);

        // Check for error response
        const errorResponse = response.data.errorResponse;
        if (errorResponse && errorResponse.errorData !== 0) {
            const errorMessage = errorResponse.errorMsg || 'Failed to update campaign status';
            throw new Error(errorMessage);
        }

        return response.data;
    } catch (error) {
        console.error('Error updating campaign status:', error);
        throw error;
    }
};

/**
 * Helper function to get brandId from localStorage
 * @returns {number} Brand ID from localStorage or default value 1
 */
export const getBrandId = () => {
    return parseInt(localStorage.getItem('collab_brand_id')) || 1;
};

/**
 * Update campaign status using brandId from localStorage
 * @param {number} campaignId - The campaign ID
 * @param {string} status - The new status
 * @returns {Promise<Object>} API response
 */
export const updateCampaignStatusWithStoredBrandId = async (campaignId, status) => {
    const brandId = getBrandId();
    return updateCampaignStatus(campaignId, brandId, status);
};


/**
 * Fetches brand details by UUID
 * @param {string} uuid - The brand UUID
 * @returns {Promise<Object>} Brand details response
 * @throws {Error} If the request fails or returns an error
 */
/**
 * Fetches brand details by UUID
 * @param {string} uuid - The brand UUID
 * @returns {Promise<Object>} Brand details response
 * @throws {Error} If the request fails or returns an error
 */
export const getBrandDetails = async (uuid) => {
    if (!uuid) {
        throw new Error('UUID is required');
    }

    try {
        const response = await apiClient.get(`${API_BASE_URL}/brand/brand_detail`, {
            params: { uuid }
        });

        // Check for API-level errors
        if (response.data?.errorResponse?.errorData !== 0) {
            throw new Error(response.data?.errorResponse?.errorMsg || 'API request failed');
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching brand details:', error);
        throw error;
    }
};

/**
 * Logout function - clears all cookies, localStorage, and redirects to login
 */

export const handleCentralizedLogout = async () => {
    const payload = {
        user_name: Cookies.get('paybito_launch_platform_username') || '',
    }
    const response = await apiClient.post(
        `https://institutional-bo.paybito.com:8443/BrokerAdminApi/adminAccess/LogoutAdmin`,
        payload
    );
    return response.data;
}




// Export all functions as named exports
export default {
    updateCampaignStatus,
    getBrandId,
    getBrandDetails,
    updateCampaignStatusWithStoredBrandId,
    handleCentralizedLogout,
    MAX_OFFER_PLACE_LIMIT,
    LOGIN_URL
};