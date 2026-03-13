/**
 * Tax Logic Plugin for Zambian Salary Calculator
 * 
 * This module provides pluggable tax calculation logic that can be
 * easily configured via config.json or replaced with custom implementations.
 * 
 * Usage:
 * 1. Include this script before your main application script
 * 2. Call taxCalculator methods with your data and configuration
 * 3. Optionally, replace the default configuration by loading config.json
 */

const taxCalculator = (function() {
    // Default configuration
    let config = {
        currency: { symbol: 'ZMW', locale: 'en-ZM', decimalPlaces: 2 },
        napsa: { enabled: true, rate: 0.05, ceiling: 1221.80, description: 'National Pension Scheme Authority' },
        nhis: { enabled: true, rate: 0.01, applyOn: 'basicPay', description: 'National Health Insurance Scheme' },
        tax: {
            enabled: true,
            bands: [
                { threshold: 4500, rate: 0, description: 'Tax-free band' },
                { threshold: 300, rate: 0.25, description: 'First taxable band' },
                { threshold: 2100, rate: 0.30, description: 'Second taxable band' },
                { threshold: null, rate: 0.375, description: 'Remaining balance' }
            ],
            calculationMethod: 'progressive'
        }
    };

    /**
     * Calculate NAPSA contribution
     * @param {number} grossPay - Gross pay amount
     * @param {object} customConfig - Optional custom configuration
     * @returns {number} NAPSA contribution amount
     */
    function calculateNAPSA(grossPay, customConfig) {
        const cfg = customConfig || config;
        if (!cfg.napsa.enabled) return 0;
        
        const napsa = grossPay * cfg.napsa.rate;
        return Math.min(napsa, cfg.napsa.ceiling);
    }

    /**
     * Calculate NHIS contribution
     * @param {number} basicPay - Basic pay amount
     * @param {object} customConfig - Optional custom configuration
     * @returns {number} NHIS contribution amount
     */
    function calculateNHIS(basicPay, customConfig) {
        const cfg = customConfig || config;
        if (!cfg.nhis.enabled) return 0;
        
        return basicPay * cfg.nhis.rate;
    }

    /**
     * Calculate PAYE tax using progressive tax bands
     * @param {number} taxableIncome - Taxable income amount
     * @param {object} customConfig - Optional custom configuration
     * @returns {number} Tax amount
     */
    function calculateTax(taxableIncome, customConfig) {
        const cfg = customConfig || config;
        if (!cfg.tax.enabled) return 0;
        
        let tax = 0;
        let remaining = taxableIncome;
        
        for (const band of cfg.tax.bands) {
            if (band.threshold === null) {
                // Last band - apply to all remaining
                tax += remaining * band.rate;
                break;
            }
            
            if (remaining <= 0) break;
            
            const taxableInBand = Math.min(remaining, band.threshold);
            tax += taxableInBand * band.rate;
            remaining -= band.threshold;
        }
        
        return tax;
    }

    /**
     * Calculate total deductions
     * @param {object} earnings - Object containing grossPay, basicPay, and loans
     * @param {object} customConfig - Optional custom configuration
     * @returns {object} Object with all deduction details
     */
    function calculateDeductions(earnings, customConfig) {
        const grossPay = earnings.grossPay || 0;
        const basicPay = earnings.basicPay || 0;
        const loans = earnings.loans || 0;
        
        const napsa = calculateNAPSA(grossPay, customConfig);
        const nhis = calculateNHIS(basicPay, customConfig);
        const tax = calculateTax(grossPay, customConfig);
        const totalDeductions = napsa + nhis + tax + loans;
        
        return {
            grossPay,
            napsa,
            nhis,
            tax,
            loans,
            totalDeductions,
            netPay: grossPay - totalDeductions
        };
    }

    /**
     * Update configuration
     * @param {object} newConfig - New configuration object
     */
    function setConfig(newConfig) {
        config = { ...config, ...newConfig };
    }

    /**
     * Get current configuration
     * @returns {object} Current configuration
     */
    function getConfig() {
        return { ...config };
    }

    /**
     * Load configuration from JSON file
     * @param {string} configPath - Path to config.json file
     * @returns {Promise<object>} Loaded configuration
     */
    function loadConfigFromFile(configPath = 'config.json') {
        return fetch(configPath)
            .then(response => {
                if (!response.ok) throw new Error('Config not found');
                return response.json();
            })
            .then(newConfig => {
                setConfig(newConfig);
                return config;
            });
    }

    /**
     * Format currency value
     * @param {number} amount - Amount to format
     * @param {object} customConfig - Optional custom configuration
     * @returns {string} Formatted currency string
     */
    function formatCurrency(amount, customConfig) {
        const cfg = customConfig || config;
        return Number(amount).toFixed(cfg.currency.decimalPlaces)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * Get tax band information for display
     * @param {object} customConfig - Optional custom configuration
     * @returns {array} Array of formatted tax band strings
     */
    function getTaxBandInfo(customConfig) {
        const cfg = customConfig || config;
        return cfg.tax.bands.map((band, index) => {
            if (band.threshold === null) {
                return `Remaining balance: ${(band.rate * 100).toFixed(1)}%`;
            }
            return `Band ${index + 1}: First ${band.threshold.toLocaleString()} at ${(band.rate * 100).toFixed(1)}%`;
        });
    }

    // Public API
    return {
        calculateNAPSA,
        calculateNHIS,
        calculateTax,
        calculateDeductions,
        setConfig,
        getConfig,
        loadConfigFromFile,
        formatCurrency,
        getTaxBandInfo
    };
})();

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = taxCalculator;
}
