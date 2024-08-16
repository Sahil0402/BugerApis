import * as cookie from "./cookie_utils.js"

document.getElementById("form").addEventListener('submit', loginOrRegister);
async function loginOrRegister(e) {
    e.preventDefault();

    var phoneNumber = document.getElementById('phoneNumber').value;
    var regex = new RegExp('^[0-9]{10}$');

    if (!regex.test(phoneNumber)) {
        if (phoneNumber.length < 10) {
            swal(`Please enter a valid 10-digit phone number.\nAdd ${10 - phoneNumber.length} digit(s)`);
        } else {
            swal(`Phone number should not be more than 10 digits.\nRemove ${phoneNumber.length - 10} digit(s)`);
        }
        return false;
    }

    try {
        let phExists = await checkUserExists(phoneNumber);
        if (phExists) {
            const loader = document.getElementById('loader');
            loader.style.display = 'block';
            try {
                const response = await getToken(phoneNumber);
                if (response && response.token) {
                    cookie.setCookie('jwtToken', JSON.stringify(response.token), 5);
                    cookie.setCookie('userId', JSON.stringify(response.user.id), 5);
                    createToast("Welcome Back!!!");
                }
            } catch (error) {
                console.log(error);
            }
        }
        else {
            // If the user doesn't exist, create a new user
            const newUserResponse = await postData('https://localhost:7030/api/PhoneNumbers', { "MobileNumber": phoneNumber });
            if (newUserResponse) {
                const response = await getToken(phoneNumber);
                if (response && response.token) {
                    cookie.setCookie('jwtToken', JSON.stringify(response.token), 5);
                    cookie.setCookie('userId', JSON.stringify(response.user.id), 5);
                    createToast("Welcome To Burger Shot!!!")
                }
            }
        }
    } catch (error) {
        console.error('Error logging in or registering:', error);
        swal("An error occurred. Please try again later.");
        return false;
    }
}
async function checkUserExists(phoneNumber) {
    const response = await fetch(`https://localhost:7030/api/PhoneNumbers/exists/${phoneNumber}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    if (!response.ok) {
        console.log(response.text());
        throw new Error(`HTTP error ${response.status}`);
    }
    let res = await response.json();
    let data = await res;
    return data;
}


async function postData(url = '', data = {}) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });


        if (!response.ok) {
            console.log(response.text());
            throw new Error(`HTTP error ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

async function getToken(phoneNumber) {
    try {
        const response = await fetch(`https://localhost:7030/api/PhoneNumbers/login/${phoneNumber}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // Check if the response is not OK
        if (!response.ok) {
            // Read the response body to get more details about the error
            const errorDetails = await response.text(); // or response.json() if the error is in JSON format
            throw new Error(`HTTP error ${response.status}: ${errorDetails}`);
        }

        // Parse the response JSON
        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error);
    }
}

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
          color:"black"
        },
        callback:function(){
            loader.style.display = 'none';
            location.replace("burgers_menu.html");
        }
      }).showToast();
}