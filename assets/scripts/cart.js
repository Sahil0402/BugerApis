import { getHeaders, getUserId } from "./generic_utils.js";
const cartButtonL = document.getElementById('cartButtonL');
let prices = [];

// Function to create the cart item element
function createCartItem(userId, id, burgerName, price, imgHyperLink, initialQuantity) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cartItem';

    // Create image container
    const imgContainer = document.createElement('div');
    const img = document.createElement('img');
    img.className = 'burger-image';
    img.src = imgHyperLink; // Use the image hyperlink from the database
    img.alt = '';
    imgContainer.appendChild(img);
    cartItem.appendChild(imgContainer);

    // Create title, type, and price container
    const titleTypePrice = document.createElement('div');
    titleTypePrice.className = 'title-type-price';

    const titleType = document.createElement('div');
    titleType.className = 'title-type';

    const burgerTitle = document.createElement('div');
    burgerTitle.className = 'burger-title';
    burgerTitle.textContent = burgerName; // Use the burger name from the database

    const vegNonvegIcons = document.createElement('div');
    vegNonvegIcons.className = 'veg-nonveg-icons';
    const nonVegIcon = document.createElement('img');
    let isVeg = burgerName.toLowerCase().includes('chicken');
    nonVegIcon.src = isVeg ? 'https://hrpl-production-mds-assets.s3.ap-south-1.amazonaws.com/icons/nonveg.svg': 'https://hrpl-production-mds-assets.s3.ap-south-1.amazonaws.com/icons/veg.svg';
    nonVegIcon.width = 15;
    nonVegIcon.alt = '';
    vegNonvegIcons.appendChild(nonVegIcon);

    titleType.appendChild(burgerTitle);
    titleType.appendChild(vegNonvegIcons);
    titleTypePrice.appendChild(titleType);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'price';
    prices.push(price);
    priceDiv.textContent = `₹ ${price.toFixed(2)}`; // Format price to two decimal places
    titleTypePrice.appendChild(priceDiv);
    cartItem.appendChild(titleTypePrice);

    // Create cart buttons container
    const cartButtons = document.createElement('div');
    cartButtons.className = 'cart-buttons';

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const quantitySpan = document.createElement('span');
    const incrementButton = createQuantityButton('increment', burgerName, userId, id, initialQuantity, quantitySpan);
    quantitySpan.className = 'quantity';
    quantitySpan.textContent = initialQuantity;

    const decrementButton = createQuantityButton('decrement', burgerName, userId, id, initialQuantity, quantitySpan);

    buttonsContainer.appendChild(incrementButton);
    buttonsContainer.appendChild(quantitySpan);
    buttonsContainer.appendChild(decrementButton);
    cartButtons.appendChild(buttonsContainer);
    cartItem.appendChild(cartButtons);

    return cartItem;
}

// Function to create increment or decrement button
function createQuantityButton(type, burgerName, userId, id, initialQuantity, quantitySpan) {
    const button = document.createElement('button');
    button.className = 'quantity-button';
    const icon = document.createElement('img');
    icon.alt = '';

    if (type === 'increment') {
        icon.src = 'https://hrpl-production-mds-assets.s3.ap-south-1.amazonaws.com/icons/add.svg';
    } else {
        icon.src = 'https://hrpl-production-mds-assets.s3.ap-south-1.amazonaws.com/icons/subtract.svg';
    }

    button.appendChild(icon);

    button.addEventListener('click', async () => {
        let quantity = parseInt(quantitySpan.textContent);
        if (type === 'increment') {
            quantity++;
        }
        if (type == 'decrement') {
            quantity--;
        }

        quantitySpan.textContent = quantity;

        if (quantity === 0) {
            await deleteCartItem(id);
        } else {
            await updateCart(userId, id, burgerName, quantity);
        }
    });

    return button;
}

// Function to update the cart
const updateCart = async (userId, id, burgerName, newQuantity) => {
    try {
        const burgerResponse = await fetch(`https://localhost:7030/api/Burgers/name/${burgerName}`,{
            method:'GET',
            headers: getHeaders()
        });
        if (!burgerResponse.ok) throw new Error('Failed to fetch burger details');

        const burgerData = await burgerResponse.json();
        const burgerPrice = burgerData.price;

        // Update the cart item
        const response = await fetch(`https://localhost:7030/api/Carts/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                Id: id,
                UserId: userId,
                BurgerName: burgerName,
                Price: burgerPrice * newQuantity,
                ImgHyperLink: burgerData.imgHyperLink,
                Quantity: newQuantity
            })
        });

        if (!response.ok) throw new Error('Failed to update cart');

        Toastify({
            text: "Cart updated successfully!!",
            duration: 2000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "white",
                color: "black"
            },
            onClick: function () { } // Callback after click
        }).showToast();

        setTimeout(() => {
            location.reload();
        }, 1000)
    } catch (error) {
        console.error('Error updating cart:', error.message);
    }
};

// Function to delete cart item
const deleteCartItem = async (id) => {
    try {
        const response = await fetch(`https://localhost:7030/api/Carts/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        if (!response.ok) throw new Error('Failed to delete cart item');
        Toastify({
            text: "Cart item deleted successfully!!",
            duration: 2000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "white",
                color: "black"
            },
            onClick: function () { } // Callback after click
        }).showToast();
        setTimeout(()=>{
            location.reload();
        }, 2000)

    } catch (error) {
        console.error('Error deleting cart item:', error.message);
    }
};

// Function to calculate total
function calculateTotal() {
    const subtotal = prices.reduce((acc, price) => acc + price, 0);
    const discount = calculateDiscount(subtotal);
    const finalAmount = subtotal - discount;

    // Update the UI with the subtotal, total, and discount
    const chargesContainer = document.querySelector('.chargesCalculation .amountValue');

    if (chargesContainer) {
        const subtotalSpan = chargesContainer.children[1]; // Assuming subtotal is the second child
        const discountSpan = chargesContainer.querySelector('#discountAmount');
        const totalPayableSpan = chargesContainer.querySelector('.totalPayable');

        subtotalSpan.textContent = `₹ ${subtotal.toFixed(2)}`; // Update subtotal with 2 decimal places
        discountSpan.textContent = `₹ ${discount.toFixed(2)}`; // Update discount with 2 decimal places
        totalPayableSpan.textContent = `₹ ${finalAmount.toFixed(2)}`;
    }
}

// Function to calculate discount
function calculateDiscount(total) {
    let discount = 0;
    if (total >= 500 && total < 1000) {
        discount = total * 0.05; // 5% discount
    } else if (total >= 1000) {
        discount = total * 0.10; // 10% discount
    }
    return discount;
}

// Function to fetch cart items for a specific user
async function fetchCartItems(userId) {
    try {
        const response = await fetch(`https://localhost:7030/api/Carts/user/${userId}`,{
            method:'GET',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch cart items');
        let data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching cart items:', error.message);
    }
}

async function checkout(userId) {
    const cartItems = await fetchCartItems(userId);

    if (cartItems.length === 0) {
        Toastify({
            text: "Your cart is empty!!",
            duration: 2000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "white",
              color:"black"
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return;
    }

    // Create the order data
    const orderData = {
        UserId: userId,
        OrderDate: new Date().toISOString(), // Set the order date
        TotalAmount: cartItems.reduce((total, item) => total + (item.price), 0),
    };

    try {
        // Create the order
        const orderResponse = await fetch('https://localhost:7030/api/Orders', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(orderData),
        });

        if (!orderResponse.ok) throw new Error('Failed to create order');
        const order = await orderResponse.json();

        // Create order items
        await createOrderItems(order.orderId, cartItems);

        Toastify({
            text: "Order placed successfully!!",
            duration: 2000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "white",
              color:"black"
            },
            onClick: function(){} // Callback after click
          }).showToast();


        // Clear the cart after successful order placement
        await clearCart(userId);

        setTimeout(() => {
            location.replace("thanks.html");
        }, 2000);

    } catch (error) {
        alert('Error during checkout: ' + error.message);
    }
}

// Function to create order items
async function createOrderItems(orderId, orderItems) {
    const promises = orderItems.map(item => {
        const orderItemData = {
            OrderId: orderId,
            Name: item.burgerName,
            Price: item.price,
            Quantity: item.quantity,
            ImageUrl: item.imgHyperLink,
        };

        return fetch('https://localhost:7030/api/OrderItems', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(orderItemData),
        });
    });

    const responses = await Promise.all(promises);
    responses.forEach(response => {
        if (!response.ok) {
            console.error('Failed to create order item:', response.statusText);
        }
    });
}

// Function to clear the cart
async function clearCart(userId) {
    try {
        const response = await fetch(`https://localhost:7030/api/Carts/user/${userId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error('Failed to clear cart');
        console.log('Cart cleared successfully');
    } catch (error) {
        console.error('Error clearing cart:', error.message);
    }
}


// Example of appending the cart item to a container
const userId = getUserId(); 
fetchCartItems(userId).then(cartItems => {
    const cartItemsC = document.getElementById('cartItems');
    cartItems.forEach(item => {
        const cartItemElement = createCartItem(userId, item.id, item.burgerName, item.price, item.imgHyperLink, item.quantity);
        cartItemsC.appendChild(cartItemElement);
    });
    calculateTotal();
});

// Checkout functionality
const checkoutButton = document.getElementById('checkout-button');
checkoutButton.addEventListener('click', () => {
    checkout(userId);
});
