"use strict";

// If someone is already logged in, they shouldn't see the auth page.
// Bounce them to their dashboard.

const alreadyLoggedIn = currentUser();

if (alreadyLoggedIn) {
  location.href = homePageFor(alreadyLoggedIn);
}

// Which role the user has picked. Starts as "parent" because
// that's the default state of the form when the page loads.
let userRole = "parent";

//Get the role buttons
const roleParentBtn = document.getElementById("roleParentBtn");
const roleCaregiverBtn = document.getElementById("roleCaregiverBtn");

//Get the fieldsets for the two roles
const parentFields = document.getElementById("parentFields");
const caregiverFields = document.getElementById("caregiverFields");

// Find the register form
const registerForm = document.getElementById("registerForm");

function setRole(role) {
  userRole = role;

  const isParent = role === "parent";

  //Show/hide the fieldsets
  parentFields.hidden = !isParent;
  parentFields.disabled = !isParent;
  caregiverFields.hidden = isParent;
  caregiverFields.disabled = isParent;

  // Highlight the correct button
  roleParentBtn.classList.toggle("active", isParent);
  roleCaregiverBtn.classList.toggle("active", !isParent);
}

// Wire up the buttons
roleParentBtn.addEventListener("click", () => setRole("parent"));
roleCaregiverBtn.addEventListener("click", () => setRole("caregiver"));

// Set the initial state
setRole("parent");

// submit event listener for register form
registerForm.addEventListener("submit", (event) => {
  //Stop the browser from navigating away from the page
  event.preventDefault();

  //Create a new user object from the form values
  const newUser = {
    id: "u" + Date.now(), // unique id based on timestamp
    role: userRole,
    name: document.getElementById("regName").value.trim(),
    email: document.getElementById("regEmail").value.trim().toLowerCase(),
    phone: document.getElementById("regPhone").value.trim(),
    location: document.getElementById("regLocation").value.trim(),
    password: document.getElementById("regPassword").value,
  };

  // Add the role-specific fields
  if (userRole === "caregiver") {
    newUser.experience = Number(document.getElementById("regExperience").value);
    newUser.rate = Number(document.getElementById("regRate").value);
    newUser.bio = document.getElementById("regBio").value.trim();
  } else {
    newUser.babyAge = document.getElementById("regBabyAge").value;
  }

  //save
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);

  //log them the user in and redirect to their dashboard
  loginAs(newUser);

  //redirect to their dashboard
  location.href = homePageFor(newUser);
});

//find the login form
const loginForm = document.getElementById("loginForm");

// submit event listener for login form
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //read the field
  const email = document
    .getElementById("loginEmail")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("loginPassword").value;

  //find the user with that email and password

  const user = getUsers();

  const foundUser = user.find(
    (user) => user.email === email && user.password === password,
  );

  if (!foundUser) {
    alert("Invalid email or password");
    return;
  }

  //log them in and redirect to their dashboard
  loginAs(foundUser);
  location.href = homePageFor(foundUser);
});
