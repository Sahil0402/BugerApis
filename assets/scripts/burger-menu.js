import { getHeaders, getUserId } from "./generic_utils.js";
const cartButtonL = document.getElementById('cartButtonL');

let cartItems = [];
let itemCount = document.getElementById('itemCount');
itemCount.style.display = "flex";

const Popular = document.getElementById('Popular');
const Combos = document.getElementById('Combos');

Popular.addEventListener('click', () => getBurgersData('Popular'));
Combos.addEventListener('click', () => getBurgersData('Combos'));

let selectedCat = 'Popular';
const userId = getUserId();

// Fetch cart items initially
async function getCartItems() {
    try {
        const response = await fetch(`https://localhost:7030/api/Carts/user/${userId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (response.status === 404) {
            return [];
        } else if (!response.ok) {
            console.log('Error fetching cart items');
        }
        return await response.json();
    } catch (error) {
        console.log('Error:', error);
        return []; // Return an empty array on error
    }
}

// Fetch cart items and then burgers
async function init() {
    cartItems = await getCartItems(); // Store cart items globally
    itemCount.innerText = cartItems.length; // Update item count
    getBurgersData(selectedCat); // No need to pass cartItems here
}

init();

async function getBurgersData(category = 'Popular') {
    selectedCat = category;
    try {
        const response = await fetch(`https://localhost:7030/api/Burgers/category/${category}`, {
            method: 'GET',
            headers: getHeaders()
        });
        const data = await response.json();
        const burgersContainer = document.getElementById('burgers');
        burgersContainer.innerHTML = "";

        if (!burgersContainer) {
            console.error('Burgers container not found!');
            return;
        }

        if (!response.ok) {
            const errorDetails = await response.text(); // Read the response body for error details
            throw new Error(`HTTP error ${response.status}: ${errorDetails}`);
        }

        data.forEach(burger => {
            const cardElement = createCardElement(burger);
            burgersContainer.appendChild(cardElement);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function createCardElement(burger) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card-container');

    const imgElement = document.createElement('img');
    imgElement.src = burger.imgHyperLink;
    imgElement.alt = burger.name;

    const nonverorveg = document.createElement('img');
    let isVeg = burger.name.toLowerCase().includes('chicken');
    nonverorveg.src = isVeg ? 'https://hrpl-production-mds-assets.s3.ap-south-1.amazonaws.com/icons/nonveg.svg' : 'https://hrpl-production-mds-assets.s3.ap-south-1.amazonaws.com/icons/veg.svg';
    nonverorveg.classList.add('nvvicon');

    const cardContentElement = document.createElement('div');
    cardContentElement.classList.add('card');

    const contentElement = document.createElement('div');
    contentElement.classList.add('content');

    const titleElement = document.createElement('span');
    titleElement.classList.add('burger-title');
    titleElement.textContent = burger.name;

    const spanPrice = document.createElement('span');
    spanPrice.classList.add("price");
    spanPrice.innerHTML = "₹" + burger.price;

    const categoryCartButtonElement = document.createElement('div');
    categoryCartButtonElement.classList.add('category-cart-button');

    const flexElement = document.createElement('div');
    flexElement.classList.add('flex', 'w-40', 'justify-evenly');

    const incrementButtonElement = createQuantityButton('add');
    const decrementButtonElement = createQuantityButton('subtract');

    const quantityElement = document.createElement('input');
    quantityElement.type = 'number';
    quantityElement.classList.add('quantity', 'w-14', 'text-center');
    quantityElement.value = '1'; // Default value
    quantityElement.min = '1';

    const addToCartButtonElement = document.createElement('button');
    addToCartButtonElement.classList.add('add-to-cart');

    // Check if the burger is already in the cart
    const existingItem = cartItems.find(item => item.burgerName === burger.name);
    if (existingItem) {
        quantityElement.value = existingItem.quantity; // Set quantity from cart
        addToCartButtonElement.textContent = 'Update cart';
    } else {
        addToCartButtonElement.textContent = 'Add to cart';
    }

    addToCartButtonElement.addEventListener('click', () => {
        addToCart(burger, parseInt(quantityElement.value));
    });

    decrementButtonElement.addEventListener('click', () => {
        decrementQuantity(quantityElement);
    });

    incrementButtonElement.addEventListener('click', () => {
        incrementQuantity(quantityElement);
    });

    // Append elements to the card
    cardContentElement.appendChild(contentElement);
    contentElement.appendChild(nonverorveg);
    contentElement.appendChild(titleElement);
    contentElement.appendChild(spanPrice);
    contentElement.appendChild(categoryCartButtonElement);
    categoryCartButtonElement.appendChild(flexElement);
    flexElement.appendChild(incrementButtonElement);
    flexElement.appendChild(quantityElement);
    flexElement.appendChild(decrementButtonElement);
    categoryCartButtonElement.appendChild(addToCartButtonElement);
    cardElement.appendChild(imgElement);
    cardElement.appendChild(cardContentElement);

    return cardElement;
}

function createQuantityButton(symbol) {
    const buttonElement = document.createElement('button');
    buttonElement.classList.add('quantity-button');
    const iconElement = document.createElement('img');
    iconElement.src = `https://hrpl-production-mds-assets.s3.ap-south-1.amazonaws.com/icons/${symbol}.svg`;
    buttonElement.appendChild(iconElement);
    return buttonElement;
}

function decrementQuantity(quantityElement) {
    let currentValue = parseInt(quantityElement.value);
    if (currentValue > 1) {
        quantityElement.value = currentValue - 1;
    }
}

function incrementQuantity(quantityElement) {
    let currentValue = parseInt(quantityElement.value);
    quantityElement.value = currentValue + 1;
    if (currentValue === 10) {
        swal("You can't order more than 10 burgers");
        quantityElement.value = 10;
    }
}

function addToCart(burger, quantity) {
    if (!userId) {
        createToast('User ID not found in local storage.');
        return;
    }

    const cartItem = {
        UserId: userId,
        BurgerName: burger.name,
        Price: burger.price * quantity,
        ImgHyperLink: burger.imgHyperLink,
        Quantity: quantity
    };

    // Check if the item already exists in the cart
    fetch(`https://localhost:7030/api/Carts/user/${userId}`, {
        'method': 'GET',
        headers: getHeaders()
    })
        .then(response => {
            if (response.status === 404) {
                return [];
            } else if (!response.ok) {
                throw new Error('Error fetching cart items');
            }
            return response.json();
        })
        .then(cartItems => {
            const existingItem = cartItems.find(item => item.burgerName === burger.name);
            if (existingItem) {
                updateCartItem(existingItem, quantity);
            } else {
                addNewCartItem(burger, quantity);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateCartItem(existingItem, quantity) {
    const updatedItem = {
        Id: existingItem.id,
        UserId: userId,
        BurgerName: existingItem.burgerName,
        Price: existingItem.price * quantity,
        ImgHyperLink: existingItem.imgHyperLink,
        Quantity: quantity,
    };

    fetch(`https://localhost:7030/api/Carts/${existingItem.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedItem)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error updating item in cart');
            }
            createToast("Item quantity updated in the cart!!");
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function addNewCartItem(burger, quantity) {
    const cartItem = {
        UserId: userId,
        BurgerName: burger.name,
        Price: burger.price * quantity,
        ImgHyperLink: burger.imgHyperLink,
        Quantity: quantity
    };

    fetch('https://localhost:7030/api/Carts', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(cartItem)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error adding item to cart');
            }
            createToast("Item added to cart!!");
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

let cartImage = document.getElementById('cartImage').addEventListener('click', (e) => {
    if (parseInt(itemCount.innerText) === 0) {
        createToast("Your cart is empty. Add something to it!!");
    } else {
        window.location.href = "cart.html";
    }
});

// Initial render
getBurgersData('Popular');

// Function to prevent back navigation
function preventBackNavigation() {
    // Push a new state to the history stack
    window.history.pushState(null, document.title, window.location.href);

    // Listen for the popstate event
    window.addEventListener('popstate', function (event) {
        // Push the same state again to prevent going back
        window.history.pushState(null, document.title, window.location.href);
    });
}

// Call the function to prevent back navigation
preventBackNavigation();

function createToast(message){
    Toastify({
        text: message,
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "white",
            color: "black"
        },
        callback: function(){
            location.reload();
        }
    }).showToast();
}