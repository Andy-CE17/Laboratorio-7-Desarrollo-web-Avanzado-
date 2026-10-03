(() => {
  if (!NexusAuth.guard({ roles: ["admin"] })) return;
  const body = document.querySelector("[data-users-body]"); const empty = document.querySelector("[data-empty-users]"); const search = document.querySelector("[data-user-search]"); let users = [];
  const roleBadge = (roles) => roles.includes("admin") ? '<span class="table-role admin"><i class="fa-solid fa-shield"></i> Admin</span>' : '<span class="table-role"><i class="fa-solid fa-user"></i> Usuario</span>';
  const render = (list) => {
    empty.hidden = list.length > 0; body.closest(".table-wrap").hidden = list.length === 0;
    body.innerHTML = list.map((user) => `<tr><td><div class="table-user"><span class="mini-avatar">${NexusAuth.initials(user)}</span><div><strong>${NexusAuth.escapeHtml(user.name)} ${NexusAuth.escapeHtml(user.lastName)}</strong><small>ID · ${NexusAuth.escapeHtml(user.id.slice(-6).toUpperCase())}</small></div></div></td><td><strong class="contact-mail">${NexusAuth.escapeHtml(user.email)}</strong><small>${NexusAuth.escapeHtml(user.phoneNumber)}</small></td><td><strong>${user.age} años</strong><small>Calculada</small></td><td>${roleBadge(user.roles)}</td><td><strong>${NexusAuth.formatDate(user.createdAt, "short")}</strong><small>Cuenta activa</small></td><td><a class="row-action" href="/admin/users/${encodeURIComponent(user.id)}" aria-label="Ver detalle"><i class="fa-solid fa-arrow-right"></i></a></td></tr>`).join("");
    document.querySelector("[data-result-count]").textContent = `${list.length} ${list.length === 1 ? "usuario" : "usuarios"}`;
  };
  NexusAuth.api("/api/users").then((data) => {
    users = data; const now = new Date();
    document.querySelector("[data-total-users]").textContent = users.length; document.querySelector("[data-standard-users]").textContent = users.filter((u) => !u.roles.includes("admin")).length; document.querySelector("[data-admin-users]").textContent = users.filter((u) => u.roles.includes("admin")).length; document.querySelector("[data-new-users]").textContent = users.filter((u) => { const d = new Date(u.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length; render(users);
  }).catch((error) => { body.innerHTML = `<tr><td colspan="6"><div class="loading-state error">${NexusAuth.escapeHtml(error.message)}</div></td></tr>`; });
  search.addEventListener("input", () => { const term = search.value.trim().toLowerCase(); render(users.filter((u) => `${u.name} ${u.lastName} ${u.email}`.toLowerCase().includes(term))); });
  document.addEventListener("keydown", (event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); search.focus(); } });
})();
