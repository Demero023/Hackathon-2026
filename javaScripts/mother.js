"use strict";

// Check who is logged in

const user = currentUser();

if (!user || user.role !== "parent") {
  location.href = "auth.html";
} else if (user.role === "parent") {
  //redirect to correct dashboard
  location.href = "caregiver.html";
} else {
  //profile greeting
  const firstName = user.name.split(" ")[0];
  document.getElementById("motherGreeting").textContent =
    "Dumela, " + firstName;

  // Fill in the profile section;
  const profile = document.getElementById("motherProfile");
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

  row("Name", user.name);
  row("Email", user.email);
  row("WhatsApp", user.phone);
  row("Town", user.location);
  row("Baby's age", user.babyAge || "Not provided");
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
