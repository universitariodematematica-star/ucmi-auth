(function () {

    /* =========================
       🔧 UTILIDADES
    ========================= */

    function getCookie(nombre) {
        const match = document.cookie.match(new RegExp('(^| )' + nombre + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }

    function borrarCookie(nombre) {
        document.cookie = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    function limpiarSesion() {
        borrarCookie("codigo");
        borrarCookie("expiracion");
        borrarCookie("session_id");
        localStorage.removeItem("session_id");
    }

    function redirigirPortal() {
        window.location.href =
            "https://ucminglesa1.blogspot.com/2026/04/portal-de-autenticacion.html";
    }

    function bloquear(mensaje) {
        document.documentElement.style.display = "block";

        document.body.innerHTML = `
            <div style="text-align:center;margin-top:60px;font-family:Arial;">
                <h2>${mensaje}</h2>
                <p>Redirigiendo...</p>
            </div>
        `;

        setTimeout(redirigirPortal, 2000);
    }

    function diasRestantes(fecha) {
        const ahora = new Date();
        const exp = new Date(fecha);
        return Math.ceil((exp - ahora) / (1000 * 60 * 60 * 24));
    }

    function banner(dias) {
        const b = document.createElement("div");

        b.style.position = "fixed";
        b.style.top = "0";
        b.style.left = "0";
        b.style.width = "100%";
        b.style.padding = "10px";
        b.style.textAlign = "center";
        b.style.fontSize = "16px";
        b.style.color = "white";
        b.style.background = dias <= 5 ? "red" : "#000080";
        b.style.zIndex = "9999";

        b.innerHTML = `Acceso activo | Te quedan ${dias} días`;

        document.body.appendChild(b);
        document.body.style.marginTop = "50px";
    }

    function validarSesion() {
        const cookieSession = getCookie("session_id");
        const localSession = localStorage.getItem("session_id");

        if (!cookieSession || !localSession || cookieSession !== localSession) {
            limpiarSesion();
            bloquear("Sesión inválida o duplicada");
            return false;
        }

        return true;
    }

    /* =========================
       🚫 OCULTAR INICIO
    ========================= */

    document.documentElement.style.display = "none";

    /* =========================
       🔐 VALIDACIÓN
    ========================= */

    const codigo = getCookie("codigo");
    const expiracion = getCookie("expiracion");
    const session_id = getCookie("session_id");

    // ❌ Sin datos básicos
    if (!codigo || !expiracion || !session_id) {
        bloquear("Acceso no autorizado");
        return;
    }

    // ⏳ Expiración
    if (new Date() > new Date(expiracion)) {
        limpiarSesion();
        bloquear("Acceso expirado");
        return;
    }

    // 🔐 Sesión única
    if (!validarSesion()) return;

    /* =========================
       ✅ ACCESO OK
    ========================= */

    const dias = diasRestantes(expiracion);

    banner(dias);

    document.documentElement.style.display = "block";

})();
