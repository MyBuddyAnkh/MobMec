/* 
    Main JavaScript file for MobMec website interactions.

    This file handles:

    1. Mobile menu open/close
    2. Navigation link behavior
    3. Service request form submission
    4. Sending service request data to Node.js backend
    5. Loading service requests from backend
    6. Displaying request cards on the page
    7. Accept / Reject / Complete button logic
    8. Contact form handling
    9. Showing success/error messages on screen
*/


/* 
    DOMContentLoaded means:
    "Run this JavaScript only after the HTML page has fully loaded."

    This is important because if JavaScript runs before HTML loads,
    document.getElementById("service-request-form") may return null
    because the form does not exist yet in the browser.
*/
document.addEventListener("DOMContentLoaded", function () {

    /* 
        Here we are selecting important HTML elements from the page.

        document.getElementById("some-id") finds one HTML element
        with that id.

        Example:
        <form id="service-request-form">
        can be selected using:
        document.getElementById("service-request-form")
    */
    const serviceRequestForm = document.getElementById("service-request-form");
    const contactForm = document.getElementById("contact-form");
    const submitRequestButton = document.getElementById("submit-request-btn");

    /* 
        querySelectorAll finds multiple elements.

        This selects all elements with class="nav-link".
        Because there can be many nav links, it returns a list.
    */
    const navLinks = document.querySelectorAll(".nav-link");

    const mobileMenuButton = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("nav-menu");


    /* 
        This is the backend API URL.

        Your Node.js backend should be running on:
        http://localhost:5000

        And your backend route for requests should be:
        /requests

        So the full API endpoint becomes:
        http://localhost:5000/requests
    */
    const API_URL = "http://localhost:5000/requests";


    /* 
        This array stores all service requests on the frontend.

        Important:
        We are not using localStorage anymore here.

        Earlier:
        Browser localStorage stored requests.

        Now:
        Backend stores requests temporarily in Node.js array.
        Frontend loads them using fetch().
    */
    let serviceRequests = [];


    /* 
        As soon as page loads, call backend and get all existing requests.

        This calls:
        GET http://localhost:5000/requests

        Then displayRequests() will show them on the page.
    */
    loadRequestsFromBackend();


    /* 
        Mobile menu logic.

        This checks if both button and nav menu exist.
        This prevents errors in case the HTML element is missing.
    */
    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener("click", function () {

            /* 
                classList.toggle("active") means:

                If navMenu does not have active class, add it.
                If navMenu already has active class, remove it.

                Usually CSS uses .active to show/hide mobile menu.
            */
            navMenu.classList.toggle("active");

            /* 
                Change button text depending on whether menu is open or closed.
            */
            if (navMenu.classList.contains("active")) {
                mobileMenuButton.textContent = "Close";
            } else {
                mobileMenuButton.textContent = "Menu";
            }
        });
    }


    /* 
        Navigation link logic.

        For each nav link, we add a click event.

        When user clicks any nav link:
        1. We log which link was clicked.
        2. We close mobile menu.
        3. We reset button text back to Menu.
    */
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            console.log("Navigation clicked:", link.textContent.trim());

            if (navMenu) {
                navMenu.classList.remove("active");
            }

            if (mobileMenuButton) {
                mobileMenuButton.textContent = "Menu";
            }
        });
    });


    /* 
        Service request form handling.

        This code runs when the customer submits the request form.
    */
    if (serviceRequestForm) {
        serviceRequestForm.addEventListener("submit", function (event) {

            /* 
                event.preventDefault() stops the browser from refreshing the page.

                Normal form behavior:
                Submit form → page refreshes

                Our behavior:
                Submit form → JavaScript handles data → send to backend
            */
            event.preventDefault();


            /* 
                Get values from form fields.

                .value gets what user typed/selected.
                .trim() removes extra spaces from start and end.
            */
            const customerName = document.getElementById("customer-name").value.trim();
            const customerPhone = document.getElementById("customer-phone").value.trim();
            const vehicleMake = document.getElementById("vehicle-make").value.trim();
            const vehicleModel = document.getElementById("vehicle-model").value.trim();
            const vehicleYear = document.getElementById("vehicle-year").value.trim();
            const serviceType = document.getElementById("service-type").value;
            const customerLocation = document.getElementById("customer-location").value.trim();
            const problemDescription = document.getElementById("problem-description").value.trim();
            const termsAgreement = document.getElementById("terms-agreement").checked;


            /* 
                Basic validation.

                We check required fields.

                If any required field is empty, or terms checkbox is not checked,
                we show an error and stop the function using return.
            */
            if (
                customerName === "" ||
                customerPhone === "" ||
                serviceType === "" ||
                customerLocation === "" ||
                problemDescription === "" ||
                !termsAgreement
            ) {
                showMessage(
                    "Please fill all required fields before submitting.",
                    "error"
                );

                return;
            }


            /* 
                Optional phone number validation.

                isValidPhoneNumber() is a helper function at the bottom.

                Right now it only checks length >= 10.
                Later you can make it more advanced.
            */
            if (!isValidPhoneNumber(customerPhone)) {
                showMessage(
                    "Please enter a valid phone number.",
                    "error"
                );

                return;
            }


            /* 
                Create a JavaScript object with request data.

                This object represents one service request.

                This is the data we will send to Node.js backend.
            */
            const requestData = {
                id: Date.now(),

                customerName: customerName,
                customerPhone: customerPhone,

                vehicleMake: vehicleMake,
                vehicleModel: vehicleModel,
                vehicleYear: vehicleYear,

                serviceType: serviceType,
                customerLocation: customerLocation,
                problemDescription: problemDescription,

                status: "Pending",
                createdAt: new Date().toLocaleString()
            };


            /* 
                Send this request object to the backend.

                This function uses fetch() with POST method.

                It will call:
                POST http://localhost:5000/requests
            */
            createRequestInBackend(requestData);


            /* 
                Reset form fields after submitting.
            */
            serviceRequestForm.reset();


            /* 
                Temporarily change button text so user gets feedback.
            */
            if (submitRequestButton) {
                submitRequestButton.textContent = "Request Submitted";

                setTimeout(function () {
                    submitRequestButton.textContent = "Submit Request";
                }, 2500);
            }
        });
    }


    /* 
        Contact form handling.

        This form is still frontend-only for now.
        It does not send data to backend yet.

        Later, you can create:
        POST /contact
        in your Node.js backend.
    */
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const contactName = document.getElementById("contact-name").value.trim();
            const contactEmail = document.getElementById("contact-email").value.trim();
            const contactMessage = document.getElementById("contact-message").value.trim();

            if (contactName === "" || contactEmail === "" || contactMessage === "") {
                showMessage("Please complete the contact form.", "error");
                return;
            }

            if (!isValidEmail(contactEmail)) {
                showMessage("Please enter a valid email address.", "error");
                return;
            }

            const contactData = {
                contactName: contactName,
                contactEmail: contactEmail,
                contactMessage: contactMessage,
                createdAt: new Date().toLocaleString()
            };

            console.log("New contact message:", contactData);

            showMessage(
                "Your message has been sent successfully.",
                "success"
            );

            contactForm.reset();
        });
    }


    /* 
        This function displays all service requests on the page.

        It uses the serviceRequests array.

        Example:
        serviceRequests = [
            { customerName: "Anmol", serviceType: "flat-tire", status: "Pending" },
            { customerName: "John", serviceType: "jump-start", status: "Accepted" }
        ]

        This function turns those objects into visible request cards.
    */
    function displayRequests() {
        const requestsList = document.getElementById("requests-list");

        /* 
            If there is no HTML element with id="requests-list",
            stop the function.

            This prevents JavaScript errors.
        */
        if (!requestsList) {
            return;
        }

        /* 
            Clear old cards before displaying updated cards.

            Why?
            Because every time status changes, we redraw the request list.
        */
        requestsList.innerHTML = "";


        /* 
            If there are no requests, show empty message.
        */
        if (serviceRequests.length === 0) {
            requestsList.innerHTML = "<p class=\"empty-requests-message\">No service requests yet.</p>";
            return;
        }


        /* 
            Loop through each request and create a card for it.
        */
        serviceRequests.forEach(function (request) {

            /* 
                Create a new div element using JavaScript.
            */
            const requestCard = document.createElement("div");

            /* 
                Add class name so CSS can style this card.
            */
            requestCard.className = "request-card";


            /* 
                innerHTML lets us put HTML inside this card.

                ${} is template literal syntax.
                It lets us insert JavaScript values into HTML strings.

                Example:
                ${request.customerName}
                becomes actual customer name.
            */
            requestCard.innerHTML = `
                <h3>${formatServiceType(request.serviceType)}</h3>

                <p><strong>Customer:</strong> ${request.customerName}</p>
                <p><strong>Phone:</strong> ${request.customerPhone}</p>
                <p><strong>Vehicle:</strong> ${formatVehicle(request)}</p>
                <p><strong>Location:</strong> ${request.customerLocation}</p>
                <p><strong>Problem:</strong> ${request.problemDescription}</p>

                <p>
                    <strong>Status:</strong> 
                    <span class="request-status">${request.status}</span>
                </p>

                <p><strong>Created:</strong> ${request.createdAt}</p>

                <div class="request-actions">
                    <button class="accept-btn" data-id="${request.id}">Accept</button>
                    <button class="reject-btn" data-id="${request.id}">Reject</button>
                    <button class="complete-btn" data-id="${request.id}">Complete</button>
                </div>
            `;


            /* 
                Add this card to the requests list section on the page.
            */
            requestsList.appendChild(requestCard);
        });


        /* 
            After creating buttons dynamically, attach click events to them.

            Important:
            These buttons did not exist when the page first loaded.
            They were created by JavaScript.

            So we add event listeners after creating the cards.
        */
        addRequestButtonEvents();
    }


    /* 
        This function adds click events to Accept, Reject, and Complete buttons.
    */
    function addRequestButtonEvents() {
        const acceptButtons = document.querySelectorAll(".accept-btn");
        const rejectButtons = document.querySelectorAll(".reject-btn");
        const completeButtons = document.querySelectorAll(".complete-btn");


        /* 
            For every Accept button:
            When clicked, update that request status to Accepted.
        */
        acceptButtons.forEach(function (button) {
            button.addEventListener("click", function () {

                /* 
                    button.dataset.id reads data-id from the button.

                    Example:
                    <button data-id="123">Accept</button>

                    button.dataset.id gives "123".

                    Number() converts it from string to number.
                */
                updateRequestStatus(Number(button.dataset.id), "Accepted");
            });
        });


        /* 
            For every Reject button:
            When clicked, update that request status to Rejected.
        */
        rejectButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                updateRequestStatus(Number(button.dataset.id), "Rejected");
            });
        });


        /* 
            For every Complete button:
            When clicked, update that request status to Completed.
        */
        completeButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                updateRequestStatus(Number(button.dataset.id), "Completed");
            });
        });
    }


    /* 
        This function updates request status in backend.

        It runs when user clicks:
        Accept
        Reject
        Complete

        It calls:
        PATCH http://localhost:5000/requests/:id/status

        Example:
        PATCH http://localhost:5000/requests/171234567/status

        Body sent:
        {
            status: "Accepted"
        }
    */
    async function updateRequestStatus(requestId, newStatus) {
        try {

            /* 
                fetch() sends request from frontend to backend.

                API_URL + "/" + requestId + "/status"
                becomes something like:
                http://localhost:5000/requests/171234567/status
            */
            const response = await fetch(API_URL + "/" + requestId + "/status", {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: newStatus
                })
            });


            /* 
                If backend sends an error response, handle it.
            */
            if (!response.ok) {
                throw new Error("Failed to update request status.");
            }


            /* 
                Convert backend JSON response into JavaScript object.
            */
            const data = await response.json();


            /* 
                Update frontend array.

                map() creates a new array.

                For the request with matching id:
                replace old request with updated request from backend.

                For all other requests:
                keep them the same.
            */
            serviceRequests = serviceRequests.map(function (request) {
                if (request.id === requestId) {
                    return data.request;
                }

                return request;
            });


            /* 
                Re-render the cards so new status appears on page.
            */
            displayRequests();

            showMessage("Request status updated to " + newStatus + ".", "success");

        } catch (error) {
            console.log("Error updating request:", error);
            showMessage("Could not update request status.", "error");
        }
    }


    /* 
        This function creates a new request in the backend.

        It runs after the service request form is submitted.

        It calls:
        POST http://localhost:5000/requests

        This is how frontend sends new customer request to Node.js.
    */
    async function createRequestInBackend(requestData) {
        try {

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                /* 
                    JavaScript object cannot be sent directly in HTTP body.
                    So we convert it into JSON string using JSON.stringify().
                */
                body: JSON.stringify(requestData)
            });


            if (!response.ok) {
                throw new Error("Failed to create request.");
            }


            /* 
                Backend sends back something like:

                {
                    message: "Request created successfully",
                    request: {
                        id: 123,
                        customerName: "...",
                        status: "Pending"
                    }
                }
            */
            const data = await response.json();


            /* 
                Add newly created request to frontend array.
            */
            serviceRequests.push(data.request);


            /* 
                Show new card immediately on page.
            */
            displayRequests();

            showMessage(
                "Your request has been submitted successfully. A nearby helper will be matched soon.",
                "success"
            );

        } catch (error) {
            console.log("Error creating request:", error);
            showMessage("Could not submit request to server.", "error");
        }
    }


    /* 
        This function formats service type.

        Example:
        "flat-tire" becomes "Flat Tire"
        "jump-start" becomes "Jump Start"

        This looks better on request cards.
    */
    function formatServiceType(serviceType) {
        if (!serviceType) {
            return "Service Request";
        }

        return serviceType
            .split("-")
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    }


    /* 
        This function combines vehicle year, make, and model.

        Example:
        year = "2010"
        make = "Toyota"
        model = "Camry"

        Output:
        "2010 Toyota Camry"

        If user leaves all vehicle fields empty,
        it returns "Not provided".
    */
    function formatVehicle(request) {
        const vehicleDetails = [
            request.vehicleYear,
            request.vehicleMake,
            request.vehicleModel
        ].filter(function (detail) {
            return detail !== "";
        });

        if (vehicleDetails.length === 0) {
            return "Not provided";
        }

        return vehicleDetails.join(" ");
    }


    /* 
        This function loads all requests from backend.

        It runs once when page opens.

        It calls:
        GET http://localhost:5000/requests

        Backend responds with array of requests.
    */
    async function loadRequestsFromBackend() {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load requests.");
            }

            serviceRequests = await response.json();

            displayRequests();

        } catch (error) {
            console.log("Error loading requests:", error);
            showMessage("Could not load requests from server.", "error");
        }
    }
});


/* 
    showMessage() is outside DOMContentLoaded.

    This means it can be used by any part of this script.

    It creates a small temporary message box on the page.

    type can be:
    "success"
    or
    "error"
*/
function showMessage(message, type) {

    /* 
        Remove old message if it already exists.

        This prevents many messages from stacking on screen.
    */
    const oldMessage = document.querySelector(".site-message");

    if (oldMessage) {
        oldMessage.remove();
    }


    /* 
        Create a new div for message.
    */
    const messageBox = document.createElement("div");

    messageBox.className = "site-message";


    /* 
        Add extra class depending on message type.

        CSS can style success and error differently.
    */
    if (type === "success") {
        messageBox.classList.add("site-message-success");
    } else {
        messageBox.classList.add("site-message-error");
    }


    /* 
        Put message text inside div.
    */
    messageBox.textContent = message;


    /* 
        Add message to page.
    */
    document.body.appendChild(messageBox);


    /* 
        Remove message after 3.5 seconds.
    */
    setTimeout(function () {
        messageBox.remove();
    }, 3500);
}


/* 
    Basic phone number check.

    Right now this only checks if phone number has at least 10 characters.

    Later you can improve this to check:
    1. Only numbers
    2. Canadian format
    3. No random letters
*/
function isValidPhoneNumber(phoneNumber) {
    return phoneNumber.length >= 10;
}


/* 
    Basic email check.

    This checks if email includes:
    @
    and
    .

    This is not perfect, but good enough for beginner frontend validation.
*/
function isValidEmail(email) {
    return email.includes("@") && email.includes(".");
}