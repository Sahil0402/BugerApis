import { getHeaders, getUserId } from "./generic_utils.js";
let userId = getUserId();

document.addEventListener('DOMContentLoaded', function () {
    fetchOrderHistory();
});

function fetchOrderHistory() {
    // Fetch order history data from the server
    fetch(`https://localhost:7030/api/Orders/user/${userId}`,{
        method:'GET',
        headers: getHeaders()
    })
        .then(response => response.json())
        .then(data => {
            displayOrderHistory(data);
        })
        .catch(error => {
            console.error('Error fetching order history:', error);
        });
}

function displayOrderHistory(orders) {
    const orderList = document.getElementById('order-list');
    // console.log(orders);

    orders.forEach(order => {

        console.log(order);
        const orderElement = document.createElement('div');
        orderElement.classList.add('order');

        const orderDetailsElement = document.createElement('div');
        orderDetailsElement.classList.add('order-details');

        const orderDateElement = document.createElement('div');
        orderDateElement.textContent = `Order Date: ${formatDate(order.orderDate)}`;

        const totalAmountElement = document.createElement('div');
        totalAmountElement.textContent = `Total Amount: ₹${order.totalAmount}`;

        orderDetailsElement.appendChild(orderDateElement);
        orderDetailsElement.appendChild(totalAmountElement);

        const orderItemsElement = document.createElement('div');
        orderItemsElement.classList.add('order-items');

        order.orderItems.forEach(item => {
            const orderItemElement = document.createElement('div');
            orderItemElement.classList.add('order-item');

            const imageElement = document.createElement('img');
            imageElement.src = item.imageUrl;

            const itemDetailsElement = document.createElement('div');
            itemDetailsElement.textContent = `${item.name} (${item.quantity} x ₹${item.price})`;

            orderItemElement.appendChild(imageElement);
            orderItemElement.appendChild(itemDetailsElement);

            orderItemsElement.appendChild(orderItemElement);
        });

        orderElement.appendChild(orderDetailsElement);
        orderElement.appendChild(orderItemsElement);

        orderList.appendChild(orderElement);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}
