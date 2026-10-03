(() => {
  const form = document.querySelector("#signUpForm"); const alert = document.querySelector("[data-alert]"); const birthdate = form.birthdate; const ageOutput = document.querySelector("[data-age-preview]");
  birthdate.max = new Date().toISOString().slice(0, 10);
  const updateAge = () => { const age = NexusAuth.calculateAge(birthdate.value); ageOutput.textContent = age === null || age < 0 ? "—" : `${age} años`; };
  const updateRules = () => { const value = form.password.value; document.querySelectorAll("[data-rule]").forEach((item) => { const pass = item.dataset.rule === "length" ? value.length >= 8 : item.dataset.rule === "uppercase" ? /[A-Z]/.test(value) : item.dataset.rule === "number" ? /\d/.test(value) : /[#$%&*@]/.test(value); item.classList.toggle("valid", pass); }); };
  birthdate.addEventListener("change", updateAge); form.password.addEventListener("input", updateRules);
  const showStep = (number) => {
    document.querySelectorAll("[data-signup-step]").forEach((step) => { step.hidden = Number(step.dataset.signupStep) !== number; step.classList.toggle("active", Number(step.dataset.signupStep) === number); });
    document.querySelectorAll("[data-progress-step]").forEach((step) => { step.classList.toggle("active", Number(step.dataset.progressStep) <= number); });
    document.querySelector("[data-step-number]").textContent = `0${number}`;
    document.querySelector("[data-step-description]").textContent = number === 1 ? "Primero, cuéntanos quién eres." : "Ahora protege y completa tu cuenta.";
    alert.hidden = true;
  };
  document.querySelector("[data-next-step]").addEventListener("click", () => {
    const required = [...document.querySelector("[data-signup-step='1']").querySelectorAll("input[required]")];
    const invalid = required.find((input) => !input.checkValidity());
    if (invalid) { invalid.reportValidity(); return; }
    showStep(2); form.password.focus();
  });
  document.querySelector("[data-prev-step]").addEventListener("click", () => showStep(1));
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
