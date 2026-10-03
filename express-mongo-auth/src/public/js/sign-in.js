(() => {
  const existing = NexusAuth.getSession(); if (existing) { NexusAuth.redirectForRoles(NexusAuth.rolesOf(existing)); return; }
  const form = document.querySelector("#signInForm"); const alert = document.querySelector("[data-alert]"); const email = form.email;
  email.value = localStorage.getItem("nexus_remembered_email") || ""; form.rememberEmail.checked = Boolean(email.value);
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
      NexusAuth.setSession(data.token, data.user);
      form.rememberEmail.checked ? localStorage.setItem("nexus_remembered_email", email.value.trim()) : localStorage.removeItem("nexus_remembered_email");
      NexusAuth.redirectForRoles(data.user.roles);
    } catch (error) { NexusAuth.showAlert(alert, error.message); NexusAuth.setLoading(button, false); }
  });
})();
