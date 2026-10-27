"use strict";

const user = currentUser();

// Track which caregiver the current request modal is for
let pendingRequestFor = null;

if (!user) {
  location.href = "auth.html";
} else if (user.role !== "parent") {
  location.href = "caregiver.html";
} else {
  // Greeting
  const firstName = user.name.split(" ")[0];
  document.getElementById("motherGreeting").textContent =
    "Dumela, " + firstName;

  // Render caregiver list
  renderCaregivers();

  // Render mother's own requests
  renderMyRequests();

  // Fill profile
  const profile = document.getElementById("motherProfile");
  profile.innerHTML = "";

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

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
    location.href = "index.html";
  });
}

// ============ RENDER CAREGIVERS ============

function renderCaregivers() {
  const container = document.getElementById("caregiverList");
  if (!container) return;
  container.innerHTML = "";

  const users = getUsers();
  const caregivers = users.filter((u) => u.role === "caregiver");

  if (caregivers.length === 0) {
    const p = document.createElement("p");
    p.textContent =
      "No caregivers have registered yet. Check back soon, or ask a Gogo you know to sign up.";
    container.appendChild(p);
    return;
  }

  caregivers.forEach((caregiver) => {
    const card = document.createElement("article");

    const name = document.createElement("h3");
    name.textContent = caregiver.name;
    card.appendChild(name);

    const location = document.createElement("p");
    location.textContent = caregiver.location;
    card.appendChild(location);

    const experience = document.createElement("p");
    experience.textContent =
      caregiver.experience +
      " years of experience · R" +
      caregiver.rate +
      " per month";
    card.appendChild(experience);

    if (caregiver.bio) {
      const bio = document.createElement("p");
      bio.textContent = caregiver.bio;
      card.appendChild(bio);
    }

    const requestBtn = document.createElement("button");
    requestBtn.type = "button";
    requestBtn.textContent = "Request care";
    requestBtn.addEventListener("click", () => openRequestModal(caregiver));
    card.appendChild(requestBtn);

    container.appendChild(card);
  });
}

// ============ REQUEST MODAL ============

function openRequestModal(caregiver) {
  pendingRequestFor = caregiver;
  document.getElementById("requestModalTitle").textContent =
    "Request " + caregiver.name;
  document.getElementById("requestModal").hidden = false;
  document.getElementById("reqMessage").value = "";
  document.getElementById("reqDate").value = "";
  document.getElementById("reqMessage").focus();
}

function closeRequestModal() {
  document.getElementById("requestModal").hidden = true;
  pendingRequestFor = null;
}

// Cancel button
const cancelBtn = document.getElementById("cancelRequestBtn");
if (cancelBtn) {
  cancelBtn.addEventListener("click", closeRequestModal);
}

// Submit request form
const requestForm = document.getElementById("requestForm");
if (requestForm) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!pendingRequestFor) return;

    const message = document.getElementById("reqMessage").value.trim();
    if (!message) {
      alert("Please write a message.");
      return;
    }

    const newRequest = {
      id: "r" + Date.now(),
      parentId: user.id,
      caregiverId: pendingRequestFor.id,
      message: message,
      startDate: document.getElementById("reqDate").value || "",
      status: "pending",
      created: new Date().toISOString(),
    };

    const requests = getRequests();
    requests.push(newRequest);
    saveRequests(requests);

    closeRequestModal();
    renderMyRequests();
    alert("Request sent to " + pendingRequestFor.name + "!");
  });
}

// ============ RENDER MOTHER'S OWN REQUESTS ============

function renderMyRequests() {
  const container = document.getElementById("motherRequestList");
  if (!container) return;
  container.innerHTML = "";

  const allRequests = getRequests();
  const mine = allRequests.filter((r) => r.parentId === user.id);

  if (mine.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No requests yet. Find a caregiver above and send one.";
    container.appendChild(p);
    return;
  }

  mine.forEach((request) => {
    const caregiver = findUserById(request.caregiverId);
    if (!caregiver) return;

    const card = document.createElement("article");

    const name = document.createElement("h3");
    name.textContent = caregiver.name;
    card.appendChild(name);

    const sent = document.createElement("p");
    sent.textContent = "Sent " + new Date(request.created).toLocaleDateString();
    card.appendChild(sent);

    const message = document.createElement("p");
    message.textContent = request.message;
    card.appendChild(message);

    const status = document.createElement("p");
    status.textContent = "Status: " + request.status;
    card.appendChild(status);

    container.appendChild(card);
  });
}
