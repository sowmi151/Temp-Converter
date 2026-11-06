// Temperature Converter logic (vanilla JS)
(function () {
  "use strict";

  const form = document.getElementById("converter");
  const input = document.getElementById("value");
  const unitSelect = document.getElementById("unit");
  const errorEl = document.getElementById("error");
  const resultsEl = document.getElementById("results");
  const outputs = {
    C: document.getElementById("out-C"),
    F: document.getElementById("out-F"),
    K: document.getElementById("out-K"),
  };

  const SYMBOL = { C: "°C", F: "°F", K: "K" };
  const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)$/;  // plain decimals only
  const EPSILON = 1e-9;                               // guards float rounding

  // ---- Conversion: everything goes through Celsius ----
  function toCelsius(value, unit) {
    if (unit === "F") return (value - 32) * 5 / 9;
    if (unit === "K") return value - 273.15;
    return value;
  }

  function fromCelsius(c) {
    return { C: c, F: c * 9 / 5 + 32, K: c + 273.15 };
  }

  // ---- Validation: returns { ok, value, message } ----
  function validate() {
    const raw = input.value.trim();

    if (raw === "") {
      return { ok: false, message: "Please enter a temperature." };
    }
    if (!NUMBER_PATTERN.test(raw)) {
      return { ok: false, message: "Please enter a number only (for example 25 or -3.5)." };
    }

    const value = parseFloat(raw);
    const celsius = toCelsius(value, unitSelect.value);

    if (celsius < -273.15 - EPSILON) {
      const limits = fromCelsius(-273.15);
      const limit = limits[unitSelect.value];
      return {
        ok: false,
        message: "That is below absolute zero (" + format(limit) + " " + SYMBOL[unitSelect.value] +
                 "), the lowest temperature possible. Please enter a higher value.",
      };
    }

    return { ok: true, value: value, celsius: celsius };
  }

  function format(n) {
    // Round to 2 decimals, avoid "-0", drop trailing zeros
    let rounded = Math.round(n * 100) / 100;
    if (Object.is(rounded, -0)) rounded = 0;
    return String(rounded);
  }

  function showError(message) {
    errorEl.textContent = message;
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    resultsEl.hidden = true;
  }

  function clearError() {
    errorEl.textContent = "";
    input.classList.remove("invalid");
    input.setAttribute("aria-invalid", "false");
  }

  // ---- Real-time validation while typing / changing unit ----
  function liveCheck() {
    if (input.value.trim() === "") {
      clearError();
      resultsEl.hidden = true;
      return;
    }
    const result = validate();
    if (result.ok) clearError();
    else showError(result.message);
  }

  input.addEventListener("input", liveCheck);
  unitSelect.addEventListener("change", liveCheck);

  // ---- Convert button (also triggered by Enter) ----
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const result = validate();

    if (!result.ok) {
      showError(result.message);
      input.focus();
      return;
    }

    clearError();
    const all = fromCelsius(result.celsius);
    Object.keys(outputs).forEach(function (unit) {
      outputs[unit].textContent = format(all[unit]) + " " + SYMBOL[unit];
      outputs[unit].parentElement.classList.toggle("source", unit === unitSelect.value);
    });
    resultsEl.hidden = false;
  });
})();
