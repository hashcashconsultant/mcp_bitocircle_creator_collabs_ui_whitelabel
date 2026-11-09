import axios from 'axios';
import Cookies from 'js-cookie';
import { handleCentralizedLogout, LOGIN_URL } from './library';
import { cookieOptions } from '../config/whitelabel';

// Create axios instance
const apiClient = axios.create({
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add authorization token if available
        const token = Cookies.get('paybito_launch_platform_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // MonetizeService needs the signed-in member's uuid with the token (the one the token belongs to).
        const uuid = Cookies.get('paybito_launch_platform_uuid');
        if (token && uuid) {
            config.headers.uuid = uuid;
        }

        // Add brand ID if available
        const brandId = localStorage.getItem('collab_brand_id');
        if (brandId) {
            config.headers['X-Brand-Id'] = brandId;
        }

        // Log request for debugging
        console.log('API Request:', {
            url: config.url,
            method: config.method?.toUpperCase(),
            data: config.data,
            headers: config.headers,
        });

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Log response for debugging
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            statusText: response.statusText,
            data: response.data,
        });

        return response;
    },
    (error) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 400:
                    console.error('Bad Request:', data);
                    error.message = data.message || 'Invalid request. Please check your input.';
                    break;
                case 401:
                    console.error('Unauthorized:', data);

                    // Clear cookies
                    Cookies.remove('paybito_launch_platform_token', cookieOptions());
                    Cookies.remove('paybito_launch_platform_uuid', cookieOptions());

                    // Show toast notification
                    if (typeof window !== 'undefined') {
                        // Dispatch custom event for toast notification
                        window.dispatchEvent(new CustomEvent('show-toast', {
                            detail: {
                                message: 'Session expired. Please login again.',
                                severity: 'warning'
                            }
                        }));

                        // Redirect after a short delay to allow toast to show
                        setTimeout(() => {
                            window.location.href = LOGIN_URL;
                        }, 1000);
                    }

                    // Return a resolved promise with error info to prevent unhandled error
                    return Promise.resolve({
                        data: {
                            errorCode: 1,
                            errorData: 1,
                            message: 'Session expired'
                        },
                        status: 401,
                        isAuthError: true
                    });

                case 403:
                    console.error('Forbidden:', data);
                    error.message = 'You do not have permission to perform this action.';
                    break;
                case 404:
                    console.error('Not Found:', data);
                    error.message = 'The requested resource was not found.';
                    break;
                case 422:
                    console.error('Validation Error:', data);
                    error.message = data.message || 'Validation failed. Please check your input.';
                    break;
                case 500:
                    console.error('Server Error:', data);
                    error.message = 'Server error. Please try again later.';
                    break;
                case 503:
                    console.error('Service Unavailable:', data);
                    error.message = 'Service temporarily unavailable. Please try again later.';
                    break;
                default:
                    error.message = data.message || `An error occurred (${status})`;
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('No Response:', error.request);
            error.message = 'No response from server. Please check your internet connection.';
        } else {
            // Something else happened
            console.error('Error:', error.message);
            error.message = error.message || 'An unexpected error occurred.';
        }

        return Promise.reject(error);
    }
);

export default apiClient;