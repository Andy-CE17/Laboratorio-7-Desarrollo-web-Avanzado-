(async () => {
  if (!NexusAuth.guard({ roles: ["user", "admin"] })) return;
  try {
    const user = await NexusAuth.api("/api/users/me");
    document.querySelector("[data-first-name]").textContent = user.name;
    document.querySelector("[data-full-name]").textContent = `${user.name} ${user.lastName}`;
    document.querySelector("[data-email]").textContent = user.email;
    document.querySelector("[data-age]").textContent = `${user.age} años`;
    document.querySelector("[data-member-since]").textContent = NexusAuth.formatDate(user.createdAt, "short");
    document.querySelector("[data-phone]").textContent = user.phoneNumber;
    document.querySelector("[data-address]").textContent = user.address || "Sin registrar";
    document.querySelector("[data-birthdate]").textContent = NexusAuth.formatDate(user.birthdate);
    document.querySelector("[data-access]").textContent = user.roles.includes("admin") ? "Administrador" : "Usuario";
    document.querySelector("[data-roles]").innerHTML = user.roles.map((role) => `<span>${NexusAuth.escapeHtml(role)}</span>`).join("");
    const fields = [user.name, user.lastName, user.email, user.phoneNumber, user.birthdate, user.url_profile, user.address]; const completion = Math.round(fields.filter(Boolean).length / fields.length * 100);
    document.querySelector("[data-completion]").textContent = `${completion}%`; document.querySelector("[data-completion-bar]").style.width = `${completion}%`;
    NexusAuth.renderAvatar(document.querySelector("[data-avatar]"), user, document.querySelector("[data-profile-initials]"));
  } catch (error) { console.error(error); }
})();
