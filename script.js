/* Main javascript file for site interactions */

document.addEventListener("DOMContentLoaded", function () {
    const serviceRequestForm = document.getElementById("service-request-form");
    const contactForm = document.getElementById("contact-form");
    const submitRequestButton = document.getElementById("submit-request-btn");
    const navLinks = document.querySelectorAll(".nav-link");
    const mobileMenuButton = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("nav-menu");

    let serviceRequests = JSON.parse(localStorage.getItem("serviceRequests")) || [];

    displayRequests();

    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener("click", function () {
            navMenu.classList.toggle("active");

            if (navMenu.classList.contains("active")) {
                mobileMenuButton.textContent = "Close";
            } else {
                mobileMenuButton.textContent = "Menu";
            }
        });
    }

    /* Smooth closes or future nav logic can use this later */
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

    /* Service request form handling */
    if (serviceRequestForm) {
        serviceRequestForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const customerName = document.getElementById("customer-name").value.trim();
            const customerPhone = document.getElementById("customer-phone").value.trim();
            const vehicleMake = document.getElementById("vehicle-make").value.trim();
            const vehicleModel = document.getElementById("vehicle-model").value.trim();
            const vehicleYear = document.getElementById("vehicle-year").value.trim();
            const serviceType = document.getElementById("service-type").value;
            const customerLocation = document.getElementById("customer-location").value.trim();
            const problemDescription = document.getElementById("problem-description").value.trim();
            const termsAgreement = document.getElementById("terms-agreement").checked;

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

            serviceRequests.push(requestData);
            saveRequestsToLocalStorage();
            displayRequests();

            showMessage(
                "Your request has been submitted successfully. A nearby helper will be matched soon.",
                "success"
            );

            serviceRequestForm.reset();

            if (submitRequestButton) {
                submitRequestButton.textContent = "Request Submitted";

                setTimeout(function () {
                    submitRequestButton.textContent = "Submit Request";
                }, 2500);
            }
        });
    }

    /* Contact form handling */
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

    function saveRequestsToLocalStorage() {
        localStorage.setItem("serviceRequests", JSON.stringify(serviceRequests));
    }

    function displayRequests() {
        const requestsList = document.getElementById("requests-list");

        if (!requestsList) {
            return;
        }

        requestsList.innerHTML = "";

        if (serviceRequests.length === 0) {
            requestsList.innerHTML = "<p class=\"empty-requests-message\">No service requests yet.</p>";
            return;
        }

        serviceRequests.forEach(function (request) {
            const requestCard = document.createElement("div");
            requestCard.className = "request-card";

            requestCard.innerHTML = `
                <h3>${formatServiceType(request.serviceType)}</h3>
                <p><strong>Customer:</strong> ${request.customerName}</p>
                <p><strong>Phone:</strong> ${request.customerPhone}</p>
                <p><strong>Vehicle:</strong> ${formatVehicle(request)}</p>
                <p><strong>Location:</strong> ${request.customerLocation}</p>
                <p><strong>Problem:</strong> ${request.problemDescription}</p>
                <p><strong>Status:</strong> <span class="request-status">${request.status}</span></p>
                <p><strong>Created:</strong> ${request.createdAt}</p>

                <div class="request-actions">
                    <button class="accept-btn" data-id="${request.id}">Accept</button>
                    <button class="reject-btn" data-id="${request.id}">Reject</button>
                    <button class="complete-btn" data-id="${request.id}">Complete</button>
                </div>
            `;

            requestsList.appendChild(requestCard);
        });

        addRequestButtonEvents();
    }

    function addRequestButtonEvents() {
        const acceptButtons = document.querySelectorAll(".accept-btn");
        const rejectButtons = document.querySelectorAll(".reject-btn");
        const completeButtons = document.querySelectorAll(".complete-btn");

        acceptButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                updateRequestStatus(Number(button.dataset.id), "Accepted");
            });
        });

        rejectButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                updateRequestStatus(Number(button.dataset.id), "Rejected");
            });
        });

        completeButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                updateRequestStatus(Number(button.dataset.id), "Completed");
            });
        });
    }

    function updateRequestStatus(requestId, newStatus) {
        serviceRequests = serviceRequests.map(function (request) {
            if (request.id === requestId) {
                request.status = newStatus;
            }

            return request;
        });

        saveRequestsToLocalStorage();
        displayRequests();

        showMessage("Request status updated to " + newStatus + ".", "success");
    }

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
});


/* Shows small alert message on the page */
function showMessage(message, type) {
    const oldMessage = document.querySelector(".site-message");

    if (oldMessage) {
        oldMessage.remove();
    }

    const messageBox = document.createElement("div");
    messageBox.className = "site-message";

    if (type === "success") {
        messageBox.classList.add("site-message-success");
    } else {
        messageBox.classList.add("site-message-error");
    }

    messageBox.textContent = message;

    document.body.appendChild(messageBox);

    setTimeout(function () {
        messageBox.remove();
    }, 3500);
}


/* Basic phone number check */
function isValidPhoneNumber(phoneNumber) {
    return phoneNumber.length >= 10;
}


/* Basic email check */
function isValidEmail(email) {
    return email.includes("@") && email.includes(".");
}
