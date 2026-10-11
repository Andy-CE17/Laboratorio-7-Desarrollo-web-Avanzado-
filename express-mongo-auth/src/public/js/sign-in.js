(() => {
  const existing = NexusAuth.getSession(); if (existing) { NexusAuth.redirectForRoles(NexusAuth.rolesOf(existing)); return; }
  const form = document.querySelector("#signInForm"); const alert = document.querySelector("[data-alert]"); const email = form.email;
  const accessButtons = [...document.querySelectorAll("[data-access-type]")];
  const accessDescription = document.querySelector("[data-access-description]");
  let selectedAccess = "user";

  const selectAccess = (access) => {
    selectedAccess = access;
    accessButtons.forEach((button) => {
      const active = button.dataset.accessType === access;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    accessDescription.textContent = access === "admin"
      ? "Ingresa con una cuenta que tenga permisos administrativos."
      : "Ingresa con tu cuenta personal.";
    email.placeholder = access === "admin" ? "correo del administrador" : "nombre@correo.com";
    alert.hidden = true;
  };

  accessButtons.forEach((button) => button.addEventListener("click", () => selectAccess(button.dataset.accessType)));
  localStorage.removeItem("nexus_remembered_email");
  email.value = "";
  form.password.value = "";
  const query = new URLSearchParams(location.search);
  if (query.has("registered")) NexusAuth.showAlert(alert, "Tu cuenta fue creada. Ya puedes iniciar sesión.", "success");
  if (query.has("session")) NexusAuth.showAlert(alert, "Tu sesión terminó. Ingresa nuevamente para continuar.");
  if (query.has("logout")) NexusAuth.showAlert(alert, "La sesión se cerró correctamente.", "success");
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const button = form.querySelector("button[type=submit]"); NexusAuth.setLoading(button, true); alert.hidden = true;
    try {
      const response = await fetch("/api/auth/signIn", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.value.trim(), password: form.password.value }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message || "Credenciales incorrectas");
      const isAdmin = data.user.roles.includes("admin");
      if ((selectedAccess === "admin" && !isAdmin) || (selectedAccess === "user" && isAdmin)) {
        throw new Error(isAdmin
          ? "Esta cuenta es de administrador. Selecciona Administrador para ingresar."
          : "Esta cuenta es personal. Selecciona Usuario para ingresar.");
      }
      NexusAuth.setSession(data.token, data.user);
      NexusAuth.redirectForRoles(data.user.roles);
    } catch (error) { NexusAuth.showAlert(alert, error.message); NexusAuth.setLoading(button, false); }
  });
})();
