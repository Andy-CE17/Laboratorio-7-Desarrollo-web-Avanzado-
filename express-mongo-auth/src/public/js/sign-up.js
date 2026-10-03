(() => {
  const form = document.querySelector("#signUpForm"); const alert = document.querySelector("[data-alert]"); const birthdate = form.birthdate; const ageOutput = document.querySelector("[data-age-preview]");
  birthdate.max = new Date().toISOString().slice(0, 10);
  const updateAge = () => { const age = NexusAuth.calculateAge(birthdate.value); ageOutput.textContent = age === null || age < 0 ? "—" : `${age} años`; };
  const updateRules = () => { const value = form.password.value; document.querySelectorAll("[data-rule]").forEach((item) => { const pass = item.dataset.rule === "length" ? value.length >= 8 : item.dataset.rule === "uppercase" ? /[A-Z]/.test(value) : item.dataset.rule === "number" ? /\d/.test(value) : /[#$%&*@]/.test(value); item.classList.toggle("valid", pass); }); };
  birthdate.addEventListener("change", updateAge); form.password.addEventListener("input", updateRules);
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); if (!form.reportValidity()) return;
    if (form.password.value !== form.confirmPassword.value) { NexusAuth.showAlert(alert, "Las contraseñas no coinciden."); return; }
    const button = form.querySelector("button[type=submit]"); NexusAuth.setLoading(button, true); alert.hidden = true;
    const payload = Object.fromEntries(new FormData(form)); delete payload.confirmPassword;
    try {
      const response = await fetch("/api/auth/signUp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json(); if (!response.ok) throw new Error(data.details?.join(". ") || data.message || "No se pudo crear la cuenta");
      window.location.href = "/signIn?registered=1";
    } catch (error) { NexusAuth.showAlert(alert, error.message); NexusAuth.setLoading(button, false); }
  });
})();
