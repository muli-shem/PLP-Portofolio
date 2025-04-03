// cart.js - JavaScript functionality for the shopping cart

document.addEventListener('DOMContentLoaded', function() {
    // Get all cart items
    const cartItems = document.querySelectorAll('.cart-item');
    
    // Initialize cart
    initializeCart();
    
    // Function to initialize cart
    function initializeCart() {
        // Set up quantity selectors
        setupQuantitySelectors();
        
        // Set up remove buttons
        setupRemoveButtons();
        
        // Update cart totals initially
        updateCartTotals();
    }
    
    // Function to set up quantity selectors
    function setupQuantitySelectors() {
        const quantitySelectors = document.querySelectorAll('.quantity-selector');
        
        quantitySelectors.forEach(selector => {
            const decreaseBtn = selector.querySelector('.decrease-qty');
            const increaseBtn = selector.querySelector('.increase-qty');
            const input = selector.querySelector('input');
            
            decreaseBtn.addEventListener('click', function() {
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                    updateItemSubtotal(selector.closest('.cart-item'));
                    updateCartTotals();
                }
            });
            
            increaseBtn.addEventListener('click', function() {
                if (parseInt(input.value) < parseInt(input.max)) {
                    input.value = parseInt(input.value) + 1;
                    updateItemSubtotal(selector.closest('.cart-item'));
                    updateCartTotals();
                }
            });
            
            input.addEventListener('change', function() {
                // Ensure value is within min and max
                let value = parseInt(input.value);
                if (isNaN(value) || value < 1) {
                    input.value = 1;
                } else if (value > parseInt(input.max)) {
                    input.value = input.max;
                }
                
                updateItemSubtotal(selector.closest('.cart-item'));
                updateCartTotals();
            });
        });
    }
    
    // Function to update item subtotal
    function updateItemSubtotal(cartItem) {
        const price = parseFloat(cartItem.querySelector('.price').textContent.replace('$', ''));
        const quantity = parseInt(cartItem.querySelector('.quantity input').value);
        const subtotal = price * quantity;
        
        cartItem.querySelector('.subtotal').textContent = '$' + subtotal.toFixed(2);
    }
    
    // Function to set up remove buttons
    function setupRemoveButtons() {
        const removeButtons = document.querySelectorAll('.remove-item');
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const cartItem = button.closest('.cart-item');
                
                // Add fade-out animation
                cartItem.style.transition = 'opacity 0.3s ease';
                cartItem.style.opacity = '0';
                
                // Remove item after animation completes
                setTimeout(() => {
                    cartItem.remove();
                    updateCartCount();
                    updateCartTotals();
                    
                    // If no items left in cart, show empty cart message
                    if (document.querySelectorAll('.cart-item').length === 0) {
                        showEmptyCartMessage();
                    }
                }, 300);
            });
        });
    }
    
    // Function to update cart totals
    function updateCartTotals() {
        let subtotal = 0;
        const shipping = parseFloat(document.querySelector('.cart-totals .total-row:nth-child(2) .value').textContent.replace('$', ''));
        
        // Calculate subtotal from all items
        document.querySelectorAll('.cart-item').forEach(item => {
            const itemSubtotal = parseFloat(item.querySelector('.subtotal').textContent.replace('$', ''));
            subtotal += itemSubtotal;
        });
        
        // Update subtotal display
        document.querySelector('.cart-totals .total-row:first-child .value').textContent = '$' + subtotal.toFixed(2);
        
        // Update grand total
        const total = subtotal + shipping;
        document.querySelector('.grand-total .value').textContent = '$' + total.toFixed(2);
    }
    
    // Function to update cart count in header
    function updateCartCount() {
        const cartCount = document.querySelectorAll('.cart-item').length;
        document.querySelector('.cart-count').textContent = cartCount;
    }
    
    // Function to show empty cart message
    function showEmptyCartMessage() {
        const cartContainer = document.querySelector('.cart-container');
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-cart-message';
        emptyMessage.innerHTML = `
            <div style="text-align: center; padding: 50px 0;">
                <i class="fas fa-shopping-cart" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="products.html" class="button" style="display: inline-block; margin-top: 20px; width: auto; padding: 10px 20px;">Continue Shopping</a>
            </div>
        `;
        
        cartContainer.innerHTML = '';
        cartContainer.appendChild(emptyMessage);
        
        // Hide cart summary
        document.querySelector('.cart-summary').style.display = 'none';
    }
    
    // Apply coupon button event listener
    const couponButton = document.querySelector('.coupon button');
    if (couponButton) {
        couponButton.addEventListener('click', function() {
            const couponInput = document.querySelector('.coupon input');
            const couponCode = couponInput.value.trim().toUpperCase();
            
            if (couponCode === 'DISCOUNT20') {
                // Example discount logic
                applyCouponDiscount(20);
                showCouponMessage('Coupon applied successfully! 20% discount added.', 'success');
            } else if (couponCode === '') {
                showCouponMessage('Please enter a coupon code.', 'warning');
            } else {
                showCouponMessage('Invalid coupon code.', 'error');
            }
        });
    }
    
    // Function to apply coupon discount
    function applyCouponDiscount(percentage) {
        // Implementation would vary based on business logic
        // This is a simplified example
        let subtotal = parseFloat(document.querySelector('.cart-totals .total-row:first-child .value').textContent.replace('$', ''));
        let discount = subtotal * (percentage / 100);
        
        // Check if discount row already exists
        let discountRow = document.querySelector('.discount-row');
        
        if (!discountRow) {
            // Create discount row if it doesn't exist
            discountRow = document.createElement('div');
            discountRow.className = 'total-row discount-row';
            discountRow.innerHTML = `
                <div class="label">Discount (${percentage}%)</div>
                <div class="value">-$${discount.toFixed(2)}</div>
            `;
            
            // Insert before grand total
            const grandTotal = document.querySelector('.grand-total');
            grandTotal.parentNode.insertBefore(discountRow, grandTotal);
        } else {
            // Update existing discount row
            discountRow.querySelector('.label').textContent = `Discount (${percentage}%)`;
            discountRow.querySelector('.value').textContent = `-$${discount.toFixed(2)}`;
        }
        
        // Recalculate total
        const shipping = parseFloat(document.querySelector('.cart-totals .total-row:nth-child(2) .value').textContent.replace('$', ''));
        const total = subtotal + shipping - discount;
        document.querySelector('.grand-total .value').textContent = '$' + total.toFixed(2);
    }
    
    // Function to show coupon message
    function showCouponMessage(message, type) {
        // Remove existing message if any
        const existingMessage = document.querySelector('.coupon-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `coupon-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.marginTop = '10px';
        messageElement.style.padding = '8px';
        messageElement.style.borderRadius = '4px';
        
        // Set style based on message type
        if (type === 'success') {
            messageElement.style.backgroundColor = '#d4edda';
            messageElement.style.color = '#155724';
        } else if (type === 'warning') {
            messageElement.style.backgroundColor = '#fff3cd';
            messageElement.style.color = '#856404';
        } else if (type === 'error') {
            messageElement.style.backgroundColor = '#f8d7da';
            messageElement.style.color = '#721c24';
        }
        
        // Add message to DOM
        document.querySelector('.coupon').appendChild(messageElement);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                messageElement.remove();
            }, 500);
        }, 3000);
    }
});