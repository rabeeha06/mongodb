// ============================
// LOGIN
// ============================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("message");

            try {

                const response =
                    await fetch("/api/login", {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })

                    });

                const data =
                    await response.json();

                if (data.success) {

                    message.textContent =
                        data.message;

                    window.location.href =
                        "dashboard.html";

                } else {

                    message.textContent =
                        data.message;

                }

            } catch (error) {

                console.error(error);

                message.textContent =
                    "Something went wrong.";

            }

        }
    );

}


// ============================
// REGISTER
// ============================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const name =
                document.getElementById("name").value;

            const email =
                document.getElementById(
                    "registerEmail"
                ).value;

            const password =
                document.getElementById(
                    "registerPassword"
                ).value;

            const message =
                document.getElementById(
                    "registerMessage"
                );

            try {

                const response =
                    await fetch("/api/register", {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })

                    });

                const data =
                    await response.json();

                message.textContent =
                    data.message;

                if (data.success) {

                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 1000);

                }

            } catch (error) {

                console.error(error);

                message.textContent =
                    "Registration failed.";

            }

        }
    );

}


// ============================
// DASHBOARD
// ============================

const welcome =
    document.getElementById("welcome");

if (welcome) {

    fetch("/api/user")

        .then(response => {

            if (!response.ok) {

                window.location.href =
                    "index.html";

                return null;

            }

            return response.json();

        })

        .then(data => {

            if (data) {

                welcome.textContent =
                    `Hello, ${data.name}!`;

                document.getElementById(
                    "userEmail"
                ).textContent =
                    data.email;

            }

        })

        .catch(error => {

            console.error(error);

            window.location.href =
                "index.html";

        });

}


// ============================
// LOGOUT
// ============================

const logout =
    document.getElementById("logout");

if (logout) {

    logout.addEventListener(
        "click",
        async () => {

            try {

                const response =
                    await fetch("/api/logout", {
                        method: "POST"
                    });

                const data =
                    await response.json();

                if (data.success) {

                    window.location.href =
                        "index.html";

                }

            } catch (error) {

                console.error(error);

            }

        }
    );

}