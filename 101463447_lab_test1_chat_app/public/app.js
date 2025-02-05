// Handle Signup
document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const password = document.getElementById("password").value;

    const userData = { username, firstname, lastname, password };

    try {
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (response.ok) {
            alert("Signup successful!");
            window.location.href = "login.html"; // Redirect to login page
        } else {
            alert(data.message || "Signup failed!");
        }
    } catch (error) {
        console.error("Error during signup:", error);
        alert("An error occurred. Please try again.");
    }
});

// Handle Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const userData = { username, password };

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            // Store JWT token in localStorage
            localStorage.setItem("token", data.token);  // Store the token
            localStorage.setItem("username", username); // Store username

            alert("Login successful!");
            window.location.href = "chat.html"; // Redirect to chat page
        } else {
            alert(data.message || "Login failed!");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
    }
});
