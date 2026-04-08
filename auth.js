(function() {

    function getCookie(nombre) {
        const match = document.cookie.match(new RegExp('(^| )' + nombre + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function setCookie(nombre, valor) {
        document.cookie = nombre + "=" + valor + "; path=/";
    }

    function limpiarCookies() {
        document.cookie = "codigo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "expiracion=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("session_id");
    }

    function bloquearAcceso(mensaje) {
        document.documentElement.style.display = "block";
        document.body.innerHTML = `
            <h2 style="text-align:center;margin-top:50px;">${mensaje}</h2>
            <p style="text-align:center;">Redirigiendo...</p>
        `;

        setTimeout(() => {
            window.location.href = "https://ucminglesa1.blogspot.com/2026/04/portal-de-autenticacion.html";
        }, 2000);
    }

    function calcularDiasRestantes(fechaExp) {
        const ahora = new Date();
        const exp = new Date(fechaExp);
        const diff = exp - ahora;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
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
        banner.style.zIndex = "9999";

        banner.innerHTML = "Acceso válido | Te quedan " + dias + " días";

        document.body.appendChild(banner);
        document.body.style.marginTop = "50px";
    }

    function generarSessionID() {
        return Math.random().toString(36).substring(2) + Date.now();
    }

    function validarSesionUnica() {
        let cookieSession = getCookie("session_id");
        let localSession = localStorage.getItem("session_id");

        // 🔥 CASO 1: no existe sesión → crearla
        if (!cookieSession && !localSession) {
            const nuevaSesion = generarSessionID();
            setCookie("session_id", nuevaSesion);
            localStorage.setItem("session_id", nuevaSesion);
            return true;
        }

        // 🔥 CASO 2: inconsistencia → bloquear
        if (cookieSession !== localSession) {
            limpiarCookies();
            bloquearAcceso("Sesión abierta en otro dispositivo");
            return false;
        }

        return true;
    }

    // 🔒 Anti-parpadeo
    document.documentElement.style.display = "none";

    const codigo = getCookie("codigo");
    const expiracion = getCookie("expiracion");

    if (!codigo || !expiracion) {
        bloquearAcceso("No has iniciado sesión");
        return;
    }

    const ahora = new Date();
    const fechaExp = new Date(expiracion);

    if (ahora > fechaExp) {
        limpiarCookies();
        bloquearAcceso("Usuario expirado");
        return;
    }

    // 🔐 Validar sesión única
    if (!validarSesionUnica()) return;

    // ✅ Usuario válido
    const dias = calcularDiasRestantes(expiracion);
    mostrarBanner(dias);

    document.documentElement.style.display = "block";

})();
