// checkout.js - JavaScript functionality for the checkout page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize checkout
    initializeCheckout();
    
    function initializeCheckout() {
        // Setup shipping address toggle
        setupShippingAddressToggle();
        
        // Setup payment method toggle
        setupPaymentMethodToggle();
        
        // Setup form validation
        setupFormValidation();
    }
    
    // Function to handle shipping address toggle
    function setupShippingAddressToggle() {
        const sameAddressCheckbox = document.getElementById('same-address');
        const shippingAddressSection = document.getElementById('shipping-address');
        
        sameAddressCheckbox.addEventListener('change', function() {
            if (this.checked) {
                shippingAddressSection.classList.add('hidden');
            } else {
                shippingAddressSection.classList.remove('hidden');
                
                // If shipping address form doesn't exist yet, create it
                if (shippingAddressSection.children.length === 0) {
                    createShippingAddressForm();
                }
            }
        });
    }
    
    // Function to create shipping address form
    function createShippingAddressForm() {
        const shippingAddressSection = document.getElementById('shipping-address');
        const billingForm = document.getElementById('billing-form');
        
        // Clone billing form structure and modify for shipping
        const shippingForm = document.createElement('form');
        shippingForm.id = 'shipping-form';
        
        // Copy form structure from billing form
        shippingForm.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="shipping-first-name">First Name *</label>
                    <input type="text" id="shipping-first-name" required>
                </div>
                <div class="form-group">
                    <label for="shipping-last-name">Last Name *</label>
                    <input type="text" id="shipping-last-name" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="shipping-company">Company Name (Optional)</label>
                <input type="text" id="shipping-company">
            </div>
            
            <div class="form-group">
                <label for="shipping-country">Country / Region *</label>
                <select id="shipping-country" required>
                    <option value="">Select a country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="shipping-street-address">Street Address *</label>
                <input type="text" id="shipping-street-address" placeholder="House number and street name" required>
                <input type="text" placeholder="Apartment, suite, unit, etc. (optional)">
            </div>
            
            <div class="form-group">
                <label for="shipping-city">City *</label>
                <input type="text" id="shipping-city" required>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="shipping-state">State *</label>
                    <select id="shipping-state" required>
                        <option value="">Select a state</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <!-- Add more states as needed -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="shipping-zip">ZIP Code *</label>
                    <input type="text" id="shipping-zip" required>
                </div>
            </div>
        `;
        
        shippingAddressSection.appendChild(shippingForm);
    }
    
    // Function to handle payment method toggle
    function setupPaymentMethodToggle() {
        const paymentOptions = document.querySelectorAll('input[name="payment"]');
        const paymentDetails = document.querySelectorAll('.payment-details');
        
        paymentOptions.forEach(option => {
            option.addEventListener('change', function() {
                // Hide all payment details sections
                paymentDetails.forEach(detail => {
                    detail.classList.add('hidden');
                });
                
                // Show the selected payment details
                const selectedPaymentDetails = document.getElementById(`${this.id}-details`);
                if (selectedPaymentDetails) {
                    selectedPaymentDetails.classList.remove('hidden');
                }
            });
        });
    }
    
    // Function to set up form validation
    function setupFormValidation() {
        const placeOrderButton = document.querySelector('.place-order button');
        
        placeOrderButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate billing form
            const billingForm = document.getElementById('billing-form');
            const requiredFields = billingForm.querySelectorAll('[required]');
            let isValid = true;
            
            // Reset error styles
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            document.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
            
            // Check each required field
            requiredFields.forEach(field => {
                if (field.value.trim() === '') {
                    isValid = false;
                    markFieldAsError(field, 'This field is required');
                } else if (field.id === 'email' && !isValidEmail(field.value)) {
                    isValid = false;
                    markFieldAsError(field, 'Please enter a valid email address');
                } else if (field.id === 'phone' && !isValidPhone(field.value)) {
                    isValid = false;
                    markFieldAsError(field, 'Please enter a valid phone number');
                } else if (field.id === 'zip' && !isValidZip(field.value)) {
                    isValid = false;
                    markFieldAsError(field, 'Please enter a valid ZIP code');
                }
            });
            
            // Check payment fields
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            if (selectedPayment && selectedPayment.id === 'credit-card') {
                const cardFields = document.querySelectorAll('#credit-card-details [required]');
                
                cardFields.forEach(field => {
                    if (field.value.trim() === '') {
                        isValid = false;
                        markFieldAsError(field, 'This field is required');
                    } else if (field.id === 'card-number' && !isValidCardNumber(field.value)) {
                        isValid = false;
                        markFieldAsError(field, 'Please enter a valid card number');
                    } else if (field.id === 'expiry' && !isValidExpiry(field.value)) {
                        isValid = false;
                        markFieldAsError(field, 'Please enter a valid expiry date (MM/YY)');
                    } else if (field.id === 'cvv' && !isValidCVV(field.value)) {
                        isValid = false;
                        markFieldAsError(field, 'Please enter a valid CVV');
                    }
                });
            }
            
            // Validate shipping fields if shipping address is different
            const sameAddressCheckbox = document.getElementById('same-address');
            if (!sameAddressCheckbox.checked) {
                const shippingForm = document.getElementById('shipping-form');
                if (shippingForm) {
                    const shippingRequiredFields = shippingForm.querySelectorAll('[required]');
                    
                    shippingRequiredFields.forEach(field => {
                        if (field.value.trim() === '') {
                            isValid = false;
                            markFieldAsError(field, 'This field is required');
                        }
                    });
                }
            }
            
            // If form is valid, simulate order submission
            if (isValid) {
                simulateOrderSubmission();
            } else {
                // Scroll to first error
                const firstError = document.querySelector('.error-field');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
    
    // Function to mark field as error
    function markFieldAsError(field, message) {
        field.classList.add('error-field');
        field.style.borderColor = '#dc3545';
        
        // Create error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        errorMessage.style.color = '#dc3545';
        errorMessage.style.fontSize = '12px';
        errorMessage.style.marginTop = '5px';
        
        // Add error message after the field
        field.parentNode.appendChild(errorMessage);
    }
    
    // Validation helper functions
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function isValidPhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(String(phone));
    }
    
    function isValidZip(zip) {
        const re = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
        return re.test(String(zip));
    }
    
    function isValidCardNumber(cardNumber) {
        // Simple validation - in real world, use a proper validation library
        const re = /^[0-9]{13,19}$/;
        return re.test(String(cardNumber).replace(/\s/g, ''));
    }
    
    function isValidExpiry(expiry) {
        const re = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        return re.test(String(expiry));
    }
    
    function isValidCVV(cvv) {
        const re = /^[0-9]{3,4}$/;
        return re.test(String(cvv));
    }
    
    // Function to simulate order submission
    function simulateOrderSubmission() {
        // Hide checkout form
        document.querySelector('.checkout-container').style.display = 'none';
        
        // Create order confirmation message
        const confirmationSection = document.createElement('div');
        confirmationSection.className = 'order-confirmation';
        confirmationSection.innerHTML = `
            <div style="text-align: center; padding: 40px 0;">
                <div style="color: #4CAF50; margin-bottom: 20px;">
                    <i class="fas fa-check-circle" style="font-size: 64px;"></i>
                </div>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your purchase. Your order has been received and is being processed.</p>
                <p>Order #: ${generateOrderNumber()}</p>
                <p>A confirmation email has been sent to your email address.</p>
                <a href="index.html" class="button" style="display: inline-block; margin-top: 20px; width: auto; padding: 10px 20px;">Continue Shopping</a>
            </div>
        `;
        
        // Add confirmation to page
        document.querySelector('.checkout-section .container').appendChild(confirmationSection);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Function to generate a random order number
    function generateOrderNumber() {
        return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    }
});