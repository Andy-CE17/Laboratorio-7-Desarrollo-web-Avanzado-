(() => {
  if (!NexusAuth.guard({ roles: ["user", "admin"] })) return;
  const form = document.querySelector("#profileForm"); const alert = document.querySelector("[data-alert]"); const birthdate = form.birthdate;
  birthdate.max = new Date().toISOString().slice(0, 10);
  const agePreview = () => { const age = NexusAuth.calculateAge(birthdate.value); document.querySelector("[data-age-preview]").textContent = age === null ? "—" : age; };
  birthdate.addEventListener("change", agePreview);
  NexusAuth.api("/api/users/me").then((user) => {
    ["name", "lastName", "email", "phoneNumber", "url_profile", "address"].forEach((key) => { form[key].value = user[key] || ""; });
    birthdate.value = user.birthdate?.slice(0, 10) || ""; agePreview();
    document.querySelector("[data-profile-name]").textContent = `${user.name} ${user.lastName}`; document.querySelector("[data-profile-email]").textContent = user.email;
    NexusAuth.renderAvatar(document.querySelector("[data-avatar]"), user, document.querySelector("[data-profile-initials]"));
  }).catch((error) => NexusAuth.showAlert(alert, error.message));
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const button = form.querySelector("button[type=submit]"); NexusAuth.setLoading(button, true); alert.hidden = true;
    try {
      const user = await NexusAuth.api("/api/users/me", { method: "PUT", body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const session = NexusAuth.getSession(); NexusAuth.setSession(session.token, { ...session.user, name: user.name, lastName: user.lastName, email: user.email, roles: user.roles });
      document.querySelector("[data-profile-name]").textContent = `${user.name} ${user.lastName}`; document.querySelector("[data-profile-email]").textContent = user.email;
      NexusAuth.renderAvatar(document.querySelector("[data-avatar]"), user, document.querySelector("[data-profile-initials]")); NexusAuth.showAlert(alert, "Los cambios se guardaron correctamente.", "success");
    } catch (error) { NexusAuth.showAlert(alert, error.details?.join(". ") || error.message); } finally { NexusAuth.setLoading(button, false); }
  });
})();
