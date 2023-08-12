const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
const registerForm = document.querySelector("#registerForm");

const InputType = {
    FIRST_NAME: "firstName",
    LAST_NAME: "lastName",
    EMAIL: "email",
    PHONE: "phone",
    PASSWORD: "password",
    CONFIRM_PASSWORD: "confirmPassword",
};

const InputError = {
    firstName: "* Can't be empty",
    lastName: "* Can't be empty",
    email: "Invalid email",
    phone: "Invalid phone number",
    password: "Must meet complexity: \n10 characters (number, letter, special)",
    confirmPassword: "* Passwords do not match",
};

const phoneRegex = /^\+?\d{8,}$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{10,}$/;

let invalidEntries = false;

const getErrorFor = (element) => {
    return element.nextElementSibling;
};

[email, phone, password, confirmPassword].forEach((e) => {
    e.addEventListener("keyup", (event) => {
        event.preventDefault();
        validateElement(event.target);
    });
});

registerForm.addEventListener("submit", (e) => {
    validateAll();

    if (invalidEntries) {
        e.preventDefault();
        return;
    }
});

phone.addEventListener("keydown", (event) => {
    const allowedKeys = ["Backspace", "+"];
    const key = event.key;

    if (/^\d$/.test(key) || allowedKeys.includes(key)) {
        return true;
    }

    event.preventDefault();
});

const validateElement = (element) => {
    if (element.name === InputType.EMAIL) {
        validateRegex(element, emailRegex, InputError.email);
    } else if (element.name === InputType.PHONE) {
        validateRegex(element, phoneRegex, InputError.phone);
    } else if (element.name === InputType.PASSWORD) {
        validateRegex(element, passwordRegex, InputError.password);
        validatePasswords(confirmPassword);
    } else if (
        element.name === InputType.FIRST_NAME ||
        element.name === InputType.LAST_NAME
    ) {
        validateNonEmptyText(element);
    } else if (element.name === InputType.CONFIRM_PASSWORD) {
        validatePasswords(element);
    }
};

const validateNonEmptyText = (element) => {
    const inputValue = element.value;
    const error = getErrorFor(element);
    if (inputValue === "" || inputValue === undefined) {
        error.style.display = "block";
        error.innerText = InputError.firstName;
        element.classList.add("invalid");

        invalidEntries = true;
    } else {
        element.classList.remove("invalid");
        error.style.display = "none";
    }
};

const validatePasswords = (element) => {
    const inputValue = element.value;
    const passwordValue = password.value;
    const error = getErrorFor(element);

    if (!comparePasswords(inputValue, passwordValue)) {
        error.style.display = "block";
        error.innerText = InputError.confirmPassword;
        element.classList.add("invalid");

        invalidEntries = true;
    } else {
        element.classList.remove("invalid");
        error.style.display = "none";
    }
};

const validateRegex = (element, regex, errorMessage) => {
    const inputValue = element.value;
    const error = getErrorFor(element);
    if (!regex.test(inputValue)) {
        error.style.display = "block";
        error.innerText = `* ${errorMessage}`;
        element.classList.add("invalid");

        invalidEntries = true;
    } else {
        element.classList.remove("invalid");
        error.style.display = "none";
    }
};

const validateAll = () => {
    invalidEntries = false;

    [email, phone, password].forEach((e) => {
        validateRegex(e, getRegexForElement(e), InputError[e.name]);
    });

    [firstName, lastName].forEach((e) => {
        validateNonEmptyText(e);
    });

    validatePasswords(confirmPassword);
};

const getRegexForElement = (element) => {
    switch (element.name) {
        case "email":
            return emailRegex;
        case "phone":
            return phoneRegex;
        default:
            return passwordRegex;
    }
};

const comparePasswords = (a, b) => {
    return a === b;
};
