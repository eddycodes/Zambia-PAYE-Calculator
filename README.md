# Zambian Salary and PAYE Calculator

A configurable salary calculator with pluggable tax logic for Zambia.

## Features

- **Configurable Tax Logic**: All tax rates, bands, and deductions are defined in `config.json`
- **Pluggable Architecture**: Easy to swap or extend tax calculation logic via `taxLogic.js`
- **Dynamic UI**: Form fields and output display are generated from configuration
- **Real-time Calculations**: Instant updates as you type
- **Responsive Design**: Works on desktop and mobile devices

## Files

- `index.html` - Main application with Vue.js frontend
- `taxLogic.js` - Pluggable tax calculation module
- `config.json` - Configuration file for tax rates, bands, and UI settings

## Configuration

Edit `config.json` to customize:

### Tax Bands
```json
"tax": {
  "bands": [
    { "threshold": 4500, "rate": 0, "description": "Tax-free band" },
    { "threshold": 300, "rate": 0.25, "description": "First taxable band" },
    { "threshold": 2100, "rate": 0.30, "description": "Second taxable band" },
    { "threshold": null, "rate": 0.375, "description": "Remaining balance" }
  ]
}
```

### NAPSA Settings
```json
"napsa": {
  "enabled": true,
  "rate": 0.05,
  "ceiling": 1221.80
}
```

### NHIS Settings
```json
"nhis": {
  "enabled": true,
  "rate": 0.01,
  "applyOn": "basicPay"
}
```

### UI Customization
```json
"ui": {
  "title": "Your Custom Title",
  "showDescriptions": true,
  "inputFields": [...],
  "outputFields": [...]
}
```

## Usage

### Running Locally

1. Start a local web server (required for fetching config.json):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if http-server is installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

2. Open `http://localhost:8000` in your browser

### Programmatic Usage

You can use the tax calculator module independently:

```javascript
// Load configuration
taxCalculator.loadConfigFromFile('config.json')
  .then(() => {
    const result = taxCalculator.calculateDeductions({
      grossPay: 10000,
      basicPay: 8000,
      loans: 500
    });
    console.log(result);
  });

// Or use with custom config
const customConfig = {
  tax: {
    enabled: true,
    bands: [
      { threshold: 5000, rate: 0 },
      { threshold: null, rate: 0.30 }
    ]
  }
};

const tax = taxCalculator.calculateTax(10000, customConfig);
```

## Extending Tax Logic

To add new deduction types or modify calculations:

1. Edit `taxLogic.js` to add new calculation methods
2. Update `config.json` with new configuration options
3. The UI will automatically adapt to configuration changes

Example - Adding a new deduction:

```javascript
// In taxLogic.js
function calculateNewDeduction(amount, customConfig) {
  const cfg = customConfig || config;
  if (!cfg.newDeduction.enabled) return 0;
  return amount * cfg.newDeduction.rate;
}

// Add to public API
return {
  // ... existing methods
  calculateNewDeduction
};
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses Vue.js 2.6 and Bootstrap 5

## License

MIT License
