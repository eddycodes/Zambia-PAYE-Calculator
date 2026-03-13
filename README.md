# Zambia-PAYE-Calculator

Zambia Pay As You Earn (PAYE) Calculator

A simple tax and net pay calculator for Zambian Employees. This project provides two implementations:
1. **Vue.js** - A frontend-only calculator (see `index.html`)
2. **Laravel** - A full-stack PHP implementation (see `Zampaycal-laravel/`)

## Features

- Calculate PAYE (Pay As You Earn) tax based on Zambian tax rates
- Calculate net pay after deductions
- Input support for:
  - Basic Pay
  - Allowances
  - Bonuses
  - Gratuity/Leave Pay

## Project Structure

```
/workspace
├── index.html              # Vue.js frontend calculator
├── css/                    # Stylesheets (Bootstrap)
├── js/                     # JavaScript files
├── Zampaycal-laravel/      # Laravel backend implementation
└── README.md               # This file
```

## Usage

### Vue.js Version (Frontend Only)

Simply open `index.html` in your web browser. The calculator uses Vue.js (loaded via CDN) and Bootstrap for styling.

1. Enter your Basic Pay
2. Add any Allowances
3. Add any Bonuses
4. Add Gratuity/Leave Pay if applicable
5. View calculated PAYE and Net Pay

### Laravel Version (Full Stack)

Navigate to the Laravel directory:

```bash
cd Zampaycal-laravel
```

#### Installation

1. Install PHP dependencies:
   ```bash
   composer install
   ```

2. Install JavaScript dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

4. Generate application key:
   ```bash
   php artisan key:generate
   ```

5. Run migrations (if applicable):
   ```bash
   php artisan migrate
   ```

6. Start the development server:
   ```bash
   php artisan serve
   ```

7. Visit `http://localhost:8000` in your browser.

## Technologies Used

- **Frontend**: Vue.js, Bootstrap
- **Backend** (Laravel version): PHP, Laravel Framework
- **Build Tools**: Composer, npm, Webpack Mix

## License

MIT License

## Author

eddycodes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.