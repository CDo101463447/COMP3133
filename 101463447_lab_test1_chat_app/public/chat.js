const socket = io("http://localhost:3000"); // Connect to the server (adjust URL if needed)
let currentRoom = "";

// Simulate successful login by setting the token directly in localStorage
localStorage.setItem("token", "your-valid-jwt-token-here");
localStorage.setItem("username", "demoUser");

// Check if the user is logged in by verifying the token in localStorage
const token = localStorage.getItem("token");

if (!token) {
    alert("You need to be logged in to access the chat.");
    window.location.href = "login.html"; // Redirect to login page if no token
} else {
    console.log("Logged in with token:", token);
}

// Join Room
document.getElementById("join-btn").addEventListener("click", async () => {
    const room = document.getElementById("room-select").value;

    if (currentRoom) {
        socket.emit("leaveRoom", currentRoom); // Leave the current room
    }

    socket.emit("joinRoom", room); // Join the selected room
    currentRoom = room;
    document.getElementById("room-name").textContent = `Room: ${room}`;
    document.getElementById("chat-container").classList.remove("d-none");
    document.getElementById("messages").innerHTML = ""; // Clear previous messages

    // Fetch old messages from the server when joining the room
    const response = await fetch(`/messages/${room}`);
    const messages = await response.json();
    messages.forEach((msg) => {
        const msgDiv = document.createElement("div");
        msgDiv.textContent = `${msg.from_user}: ${msg.message}`;
        document.getElementById("messages").appendChild(msgDiv);
});
});

// Send Message
document.getElementById("send-btn").addEventListener("click", () => {
    const message = document.getElementById("message-input").value;
    const username = localStorage.getItem("username") || "Anonymous";

    if (message) {
        socket.emit("sendMessage", { room: currentRoom, message, username });
        document.getElementById("message-input").value = "";
    }
});

// Handle receiving a message from the server
socket.on("receiveMessage", (data) => {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = `${data.from}: ${data.message}`;
    document.getElementById("messages").appendChild(msgDiv);
});

// Handle typing indicator
function notifyTyping() {
    socket.emit("typing", { room: currentRoom, username: localStorage.getItem("username") });
}

socket.on("userTyping", (data) => {
    document.getElementById("typing-indicator").textContent = `${data.username} is typing...`;
    setTimeout(() => {
        document.getElementById("typing-indicator").textContent = "";
    }, 3000);
});

// Logout functionality
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    alert("Logged out successfully!");
    window.location.href = "login.html"; // Redirect to login page
});

// Leave Room functionality
document.getElementById("leave-btn").addEventListener("click", () => {
    socket.emit("leaveRoom", currentRoom); // Leave the current room
    currentRoom = "";
    document.getElementById("chat-container").classList.add("d-none"); // Hide chat container
});
