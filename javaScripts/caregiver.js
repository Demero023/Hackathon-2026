"use strict";

const user = currentUser();

if (!user) {
  location.href = "auth.html";
} else if (user.role !== "caregiver") {
  location.href = "mother.html";
} else {
  // Greeting
  const firstName = user.name.split(" ")[0];
  document.getElementById("caregiverGreeting").textContent =
    "Dumela, " + firstName;

  // Render notification + request list
  renderNotifications();
  renderRequests();

  // Profile
  const profile = document.getElementById("caregiverProfile");
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
  row("Experience", user.experience + " years");
  row("Monthly Rate", "R" + user.rate);
  row("Bio", user.bio || "No bio provided");
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

// ============ NOTIFICATION ============

function renderNotifications() {
  const heading = document.getElementById("notificationsHeading");
  const text = document.getElementById("notificationsText");
  if (!heading || !text) return;

  const mine = getRequests().filter((r) => r.caregiverId === user.id);
  const pending = mine.filter((r) => r.status === "pending").length;

  if (pending === 0) {
    heading.textContent = "No new requests";
    text.textContent =
      "When a mother sends you a request, it will appear below.";
  } else if (pending === 1) {
    heading.textContent = "You have 1 new request";
    text.textContent = "Scroll down to read it and reply.";
  } else {
    heading.textContent = "You have " + pending + " new requests";
    text.textContent = "Scroll down to read them and reply.";
  }
}

// ============ REQUEST LIST ============

function renderRequests() {
  const container = document.getElementById("requestList");
  if (!container) return;
  container.innerHTML = "";

  const mine = getRequests().filter((r) => r.caregiverId === user.id);

  if (mine.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No requests yet. Mothers will contact you here.";
    container.appendChild(p);
    return;
  }

  // Show newest first
  mine.reverse().forEach((request) => {
    const parent = findUserById(request.parentId);
    if (!parent) return;

    const card = document.createElement("article");

    const name = document.createElement("h3");
    name.textContent = parent.name;
    card.appendChild(name);

    const detail = document.createElement("p");
    detail.textContent =
      parent.location + " · Baby " + (parent.babyAge || "?") + " old";
    card.appendChild(detail);

    const message = document.createElement("p");
    message.textContent = request.message;
    card.appendChild(message);

    const sent = document.createElement("p");
    sent.textContent = "Sent " + new Date(request.created).toLocaleDateString();
    card.appendChild(sent);

    const status = document.createElement("p");
    status.textContent = "Status: " + request.status;
    card.appendChild(status);

    // Actions based on status
    if (request.status === "pending") {
      const acceptBtn = document.createElement("button");
      acceptBtn.type = "button";
      acceptBtn.textContent = "Accept";
      acceptBtn.addEventListener("click", () =>
        updateRequestStatus(request.id, "accepted"),
      );
      card.appendChild(acceptBtn);

      const declineBtn = document.createElement("button");
      declineBtn.type = "button";
      declineBtn.textContent = "Decline";
      declineBtn.addEventListener("click", () =>
        updateRequestStatus(request.id, "declined"),
      );
      card.appendChild(declineBtn);
    } else if (request.status === "accepted") {
      const waLink = document.createElement("a");
      const digits = (parent.phone || "").replace(/\D/g, "");
      const intl = digits.startsWith("0") ? "27" + digits.slice(1) : digits;
      waLink.href = "https://wa.me/" + intl;
      waLink.target = "_blank";
      waLink.textContent = "Chat on WhatsApp";
      card.appendChild(waLink);
    }

    container.appendChild(card);
  });
}

// ============ UPDATE REQUEST STATUS ============

function updateRequestStatus(id, status) {
  const requests = getRequests();
  const request = requests.find((r) => r.id === id);
  if (!request) return;

  request.status = status;
  saveRequests(requests);

  renderNotifications();
  renderRequests();
}
