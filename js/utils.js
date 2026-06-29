// get all users

function getAllUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// save users
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Save logged in user
function setLoggedInUser(user) {
  localStorage.setItem("loggedInUser", JSON.stringify(user));
}


// Get logged in user
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}
console.log(getLoggedInUser());
// Logout
function logout() {
  localStorage.removeItem("loggedInUser");
}
