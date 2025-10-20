// Update time in milliseconds for home page
function updateTime() {
  const timeElement = document.getElementById("current-time");
  if (timeElement) {
    timeElement.textContent = Date.now();
  }
}

// Contact form validation
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const successMessage = document.getElementById("successMessage");
  const submitButton = contactForm.querySelector(
    '[data-testid="test-contact-submit"]'
  );

  // Form validation rules
  const validationRules = {
    fullName: {
      required: true,
      message: "Please enter your full name",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    subject: {
      required: true,
      message: "Please enter a subject",
    },
    message: {
      required: true,
      minLength: 10,
      message: "Message must be at least 10 characters long",
    },
  };

  // Validate individual field
  function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    const errorElement = document.querySelector(
      `[data-testid="test-contact-error-${fieldName}"]`
    );
    const inputElement = document.getElementById(fieldName);

    if (!errorElement || !inputElement) return true;

    // Clear previous states
    inputElement.classList.remove("valid", "invalid");
    errorElement.textContent = "";
    errorElement.style.display = "none";

    // Required field validation
    if (rules.required && !value.trim()) {
      inputElement.classList.add("invalid");
      errorElement.textContent = rules.message;
      errorElement.style.display = "block";
      return false;
    }

    // Email pattern validation
    if (fieldName === "email" && rules.pattern && !rules.pattern.test(value)) {
      inputElement.classList.add("invalid");
      errorElement.textContent = rules.message;
      errorElement.style.display = "block";
      return false;
    }

    // Message length validation
    if (
      fieldName === "message" &&
      rules.minLength &&
      value.length < rules.minLength
    ) {
      inputElement.classList.add("invalid");
      errorElement.textContent = rules.message;
      errorElement.style.display = "block";
      return false;
    }

    // Valid field
    inputElement.classList.add("valid");
    return true;
  }

  // Validate entire form
  function validateForm() {
    let isValid = true;
    const formData = new FormData(contactForm);

    Object.keys(validationRules).forEach((fieldName) => {
      const value = formData.get(fieldName) || "";
      if (!validateField(fieldName, value)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Real-time validation
  contactForm.addEventListener("input", (e) => {
    if (e.target.matches("input, textarea")) {
      const fieldName = e.target.name;
      const value = e.target.value;
      validateField(fieldName, value);
    }
  });

  // Form submission
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Hide success message if it was previously shown
    successMessage.style.display = "none";

    if (validateForm()) {
      // Show success message
      successMessage.style.display = "block";

      // Reset form
      contactForm.reset();

      // Remove validation classes
      contactForm.querySelectorAll("input, textarea").forEach((input) => {
        input.classList.remove("valid", "invalid");
      });

      // Hide error messages
      contactForm.querySelectorAll(".error-message").forEach((error) => {
        error.style.display = "none";
        error.textContent = "";
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 5000);
    } else {
      // Focus on first invalid field
      const firstInvalid = contactForm.querySelector(".invalid");
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });

  // Add blur validation for better UX
  contactForm.addEventListener(
    "blur",
    (e) => {
      if (e.target.matches("input, textarea")) {
        const fieldName = e.target.name;
        const value = e.target.value;
        validateField(fieldName, value);
      }
    },
    true
  );

  // Accessibility: Handle Enter key on error messages
  contactForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.classList.contains("error-message")) {
      e.preventDefault();
      const fieldId = e.target.id.replace("-error", "");
      document.getElementById(fieldId)?.focus();
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  updateTime();
  setInterval(updateTime, 1000);
  initializeContactForm();
});
