/* Main javascript file for site interactions */

document.addEventListener("DOMContentLoaded", function () {
    const serviceRequestForm = document.getElementById("service-request-form");
    const contactForm = document.getElementById("contact-form");
    const submitRequestButton = document.getElementById("submit-request-btn");
    const navLinks = document.querySelectorAll(".nav-link");

    /* Smooth closes or future nav logic can use this later */
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            console.log("Navigation clicked:", link.textContent.trim());
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

            console.log("New service request:", requestData);

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