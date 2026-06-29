const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    const users = getAllUsers();


    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      alert("Username already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      username,
      password,
      currency: "USD ($)",
      transactions: [],
    };


    users.push(newUser);

    saveUsers(users);

    alert("User registered successfully");

    window.location.href = "index.html"; 
  });
}

// login

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!username || !password) {
      alert("All fields are required.");
      return;
    }

    //get all users

    const users = getAllUsers();

    const existingUser = users.find(
      (user) => user.username === username && user.password === password,
    );
    if (!existingUser) {
      alert("Invalid username or password.");
      return;
    }

    setLoggedInUser(existingUser);
    window.location.href = "dashboard.html";
  });
}
