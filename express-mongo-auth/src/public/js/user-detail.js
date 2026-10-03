(async () => {
  if (!NexusAuth.guard({ roles: ["admin"] })) return;
  try {
    const id = document.body.dataset.userId; const user = await NexusAuth.api(`/api/users/${encodeURIComponent(id)}`);
    document.querySelector("[data-detail-name]").textContent = `${user.name} ${user.lastName}`; document.querySelector("[data-detail-email]").textContent = user.email; document.querySelector("[data-detail-id]").textContent = user.id; document.querySelector("[data-detail-phone]").textContent = user.phoneNumber; document.querySelector("[data-detail-age]").textContent = `${user.age} años`; document.querySelector("[data-detail-birthdate]").textContent = NexusAuth.formatDate(user.birthdate); document.querySelector("[data-detail-created]").textContent = NexusAuth.formatDate(user.createdAt); document.querySelector("[data-detail-address]").textContent = user.address || "Sin registrar"; document.querySelector("[data-detail-roles]").innerHTML = user.roles.map((role) => `<span>${NexusAuth.escapeHtml(role)}</span>`).join("");
    NexusAuth.renderAvatar(document.querySelector("[data-avatar]"), user, document.querySelector("[data-detail-initials]"));
  } catch (error) { document.querySelector("[data-detail-name]").textContent = error.message; }
})();
