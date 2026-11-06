# Temperature Converter

Vanilla HTML5 / CSS3 / JavaScript tool that converts between Celsius, Fahrenheit and Kelvin.

## Structure
```
temp-converter/
├── index.html
├── css/style.css
├── js/script.js
└── README.md
```

## Run
Open `index.html` in a browser. No build step or dependencies.

## Features
- Text input with real-time validation (rejects empty and non-numeric input)
- Unit dropdown: Celsius, Fahrenheit, Kelvin
- Convert button (Enter key also works)
- Results show all three units at once, rounded to 2 decimals
- Absolute zero check (below -273.15 °C, -459.67 °F or 0 K) with a friendly message
- Centred, responsive layout

## Formulas
- C to F: C x 9/5 + 32
- F to C: (F - 32) x 5/9
- C to K: C + 273.15
