"use strict";

const user = currentUser();

// If no user is logged in, redirect to the auth page.
// If a user is logged in but is not a caregiver, redirect to the mother page.
// Otherwise, display the caregiver's profile information.

if (!user) {
  location.href = "auth.html";
} else if (user.role !== "caregiver") {
  location.href = "mother.html";
} else {
  //profile greeting
  const firstName = user.name.split(" ")[0];
  document.getElementById("caregiverGreeting").textContent =
    "Dumela, " + firstName;

  const profile = document.getElementById("caregiverProfile");
  profile.innerHTML = "";

  // each row of the profile is a <dt> and <dd> pair
  function row(label, value) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    profile.appendChild(dt);

    const dd = document.createElement("dd");
    dd.textContent = value;
    profile.appendChild(dd);
  }

  // Fill in the profile section with the caregiver's information
  row("Name", user.name);
  row("Email", user.email);
  row("WhatsApp", user.phone);
  row("Town", user.location);
  row("Experience", user.experience + " years");
  row("Monthly Rate", "R" + user.rate);
  row("Bio", user.bio || "No bio provided");
}

// Logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
    location.href = "index.html";
  });
}
