(() => {
  const TOKEN_KEY = "nexus_token";
  const USER_KEY = "nexus_user";

  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(decodeURIComponent(atob(payload).split("").map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`).join("")));
    } catch { return null; }
  };

  const getSession = () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const payload = decodeToken(token);
    if (!payload || payload.exp * 1000 <= Date.now()) {
      sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(USER_KEY); return null;
    }
    let user = null;
    try { user = JSON.parse(sessionStorage.getItem(USER_KEY)); } catch { user = null; }
    return { token, payload, user };
  };

  const setSession = (token, user) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  };
  const clearSession = () => { sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(USER_KEY); };
  const rolesOf = (session) => session?.user?.roles || session?.payload?.roles || [];
  const redirectForRoles = (roles = []) => { window.location.href = roles.includes("admin") ? "/admin" : "/dashboard"; };
  const initials = (user = {}) => `${user.name?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "US";
  const formatDate = (value, style = "long") => value ? new Intl.DateTimeFormat("es-PE", style === "short" ? { day: "2-digit", month: "short", year: "numeric" } : { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : "—";
  const calculateAge = (value) => {
    if (!value) return null;
    const today = new Date(); const birth = new Date(`${String(value).slice(0, 10)}T12:00:00`);
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age -= 1;
    return age;
  };
  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

  const hydrateNav = (user, roles = []) => {
    document.querySelectorAll("[data-user-initials]").forEach((el) => { el.textContent = initials(user); });
    document.querySelectorAll("[data-user-name]").forEach((el) => { el.textContent = user?.name || "Usuario"; });
    document.querySelectorAll("[data-user-role]").forEach((el) => { el.textContent = roles.includes("admin") ? "Administrador" : "Usuario"; });
    document.querySelectorAll("[data-nav-admin]").forEach((el) => { el.hidden = !roles.includes("admin"); });
    document.querySelectorAll("[data-nav-user]").forEach((el) => { el.href = roles.includes("admin") ? "/admin" : "/dashboard"; });
  };

  const guard = ({ roles } = {}) => {
    const session = getSession();
    if (!session) { window.location.replace("/signIn?session=expired"); return null; }
    const userRoles = rolesOf(session);
    if (roles?.length && !roles.some((role) => userRoles.includes(role))) { window.location.replace("/403"); return null; }
    hydrateNav(session.user || session.payload, userRoles);
    return session;
  };

  const api = async (url, options = {}) => {
    const session = getSession();
    const headers = { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) };
    if (session?.token) headers.Authorization = `Bearer ${session.token}`;
    const response = await fetch(url, { ...options, headers });
    let data = {};
    try { data = await response.json(); } catch { data = {}; }
    if (response.status === 401) { clearSession(); window.location.replace("/signIn?session=expired"); throw new Error("Sesión expirada"); }
    if (!response.ok) { const error = new Error(data.message || "No se pudo completar la solicitud"); error.status = response.status; error.details = data.details; throw error; }
    return data;
  };

  const showAlert = (element, message, type = "error") => {
    if (!element) return; element.hidden = false; element.className = `alert ${type}`;
    element.innerHTML = `<i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}"></i><span>${escapeHtml(message)}</span>`;
  };
  const setLoading = (button, loading) => {
    if (!button) return; button.disabled = loading;
    if (!button.dataset.original) button.dataset.original = button.innerHTML;
    button.innerHTML = loading ? '<span class="button-loader"></span><span>Procesando...</span>' : button.dataset.original;
  };
  const renderAvatar = (container, user, initialsTarget) => {
    if (initialsTarget) initialsTarget.textContent = initials(user);
    const oldImage = container?.querySelector("img"); if (oldImage) oldImage.remove();
    if (container && user?.url_profile) {
      const image = new Image(); image.alt = `Perfil de ${user.name}`; image.referrerPolicy = "no-referrer";
      image.onload = () => container.prepend(image); image.src = user.url_profile;
    }
  };

  document.addEventListener("click", (event) => {
    const logout = event.target.closest("[data-logout]");
    if (logout) { clearSession(); window.location.href = "/signIn?logout=1"; }
    const toggle = event.target.closest("[data-toggle-password]");
    if (toggle) { const input = toggle.closest(".modern-field").querySelector("input"); const visible = input.type === "text"; input.type = visible ? "password" : "text"; toggle.innerHTML = `<i class="fa-regular fa-eye${visible ? "" : "-slash"}"></i>`; }
  });

  window.NexusAuth = { api, calculateAge, clearSession, escapeHtml, formatDate, getSession, guard, initials, redirectForRoles, renderAvatar, rolesOf, setLoading, setSession, showAlert };
})();
