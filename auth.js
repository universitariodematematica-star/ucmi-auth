(function () {

    /* =========================
       🔧 UTILIDADES
    ========================= */

    function getCookie(nombre) {
        const match = document.cookie.match(new RegExp('(^| )' + nombre + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function setCookie(nombre, valor) {
        document.cookie = nombre + "=" + valor + "; path=/";
    }

    function borrarCookie(nombre) {
        document.cookie = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    function limpiarCookies() {
        borrarCookie("codigo");
        borrarCookie("expiracion");
        borrarCookie("session_id");
        borrarCookie("acceso_valido");
        localStorage.removeItem("session_id");
    }

    function redirigirPortal() {
        window.location.href =
            "https://ucminglesa1.blogspot.com/2026/04/portal-de-autenticacion.html";
    }

    function bloquearAcceso(mensaje) {

        document.documentElement.style.display = "block";

        document.body.innerHTML = `
            <div style="text-align:center;margin-top:60px;font-family:Arial;">
                <h2>${mensaje}</h2>
                <p>Redirigiendo al portal...</p>
            </div>
        `;

        setTimeout(redirigirPortal, 2000);
    }

    function calcularDiasRestantes(fechaExp) {
        const ahora = new Date();
        const exp = new Date(fechaExp);
        return Math.ceil((exp - ahora) / (1000 * 60 * 60 * 24));
    }

    function mostrarBanner(dias) {
        const banner = document.createElement("div");

        banner.style.position = "fixed";
        banner.style.top = "0";
        banner.style.left = "0";
        banner.style.width = "100%";
        banner.style.backgroundColor = dias <= 5 ? "red" : "#000080";
        banner.style.color = "white";
        banner.style.textAlign = "center";
        banner.style.padding = "10px";
        banner.style.fontSize = "16px";
        banner.style.zIndex = "9999";

        banner.innerHTML = "Acceso activo | Te quedan " + dias + " días";

        document.body.appendChild(banner);
        document.body.style.marginTop = "50px";
    }

    function generarSessionID() {
        return Math.random().toString(36).substring(2) + Date.now();
    }

    function validarSesionUnica() {
        const cookieSession = getCookie("session_id");
        const localSession = localStorage.getItem("session_id");

        if (!cookieSession || !localSession || cookieSession !== localSession) {
            limpiarCookies();
            bloquearAcceso("Sesión inválida o duplicada");
            return false;
        }

        return true;
    }

    /* =========================
       🚫 BLOQUEO INICIAL
    ========================= */

    document.documentElement.style.display = "none";

    /* =========================
       🔐 VALIDACIÓN PRINCIPAL
    ========================= */

    const codigo = getCookie("codigo");
    const expiracion = getCookie("expiracion");
    const acceso = getCookie("acceso_valido");

    // 🚫 Acceso directo por URL
    if (!acceso) {
        bloquearAcceso("Acceso directo no permitido");
        return;
    }

    // 🔥 Uso único del acceso temporal
    borrarCookie("acceso_valido");

    // 🚫 Sin sesión
    if (!codigo || !expiracion) {
        bloquearAcceso("No has iniciado sesión");
        return;
    }

    // ⏳ Expiración
    const ahora = new Date();
    const fechaExp = new Date(expiracion);

    if (ahora > fechaExp) {
        limpiarCookies();
        bloquearAcceso("Usuario expirado");
        return;
    }

    // 🔐 Sesión única
    if (!validarSesionUnica()) return;

    /* =========================
       ✅ ACCESO PERMITIDO
    ========================= */

    const dias = calcularDiasRestantes(expiracion);

    mostrarBanner(dias);

    document.documentElement.style.display = "block";

})();
