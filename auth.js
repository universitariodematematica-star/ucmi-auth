(function () {

    /* =========================
       🔐 BASE DE USUARIOS
    ========================= */

    const estudiantes = {
        "123": { nombre: "Licencia 6 meses", expira: "2026-10-06T00:00:00Z" },
        "456": { nombre: "Licencia 6 meses", expira: "2026-10-06T00:00:00Z" },
        "789": { nombre: "Licencia 1 año", expira: "2027-04-06T00:00:00Z" },
        "012": { nombre: "Licencia 1 año", expira: "2027-04-06T00:00:00Z" }
    };

    /* =========================
       🔧 UTILIDADES
    ========================= */

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }

    function generarSessionID() {
        return Math.random().toString(36).substring(2) + Date.now();
    }

    function formatearFecha(fecha) {
        return new Date(fecha).toLocaleString();
    }

    function calcularDias(fecha) {
        return Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
    }

    /* =========================
       🚨 BLOQUEO
    ========================= */

    function bloquear(mensaje) {

        document.body.innerHTML = `
            <div style="text-align:center;margin-top:60px;font-family:Arial;">
                <h2>${mensaje}</h2>
                <p>Redirigiendo al portal...</p>
            </div>
        `;

        setTimeout(() => {
            window.location.href =
                "https://ucminglesa1.blogspot.com/2026/04/portal-de-autenticacion.html";
        }, 2000);
    }

    /* =========================
       🚪 VALIDACIÓN PRINCIPAL
    ========================= */

    document.addEventListener("DOMContentLoaded", function () {

        const codigo = getCookie("codigo");
        const session = getCookie("session_id");
        const expCookie = getCookie("expiracion");

        /* ❌ sin datos */
        if (!codigo || !session || !expCookie) {
            bloquear("Acceso no autorizado");
            return;
        }

        /* ❌ código inválido */
        if (!estudiantes[codigo]) {
            bloquear("Código inválido");
            return;
        }

        const usuario = estudiantes[codigo];
        const expReal = new Date(usuario.expira);

        /* ❌ expirado (FUENTE REAL, no cookie) */
        if (new Date() > expReal) {
            bloquear("Acceso expirado");
            return;
        }

        /* 🔐 sesión coherente */
        const localSession = localStorage.getItem("session_id");

        if (!localSession || localSession !== session) {
            bloquear("Sesión inválida");
            return;
        }

        /* =========================
           ✅ ACCESO PERMITIDO
        ========================= */

        document.documentElement.style.display = "block";

        const dias = calcularDias(usuario.expira);

        const banner = document.createElement("div");
        banner.style.position = "fixed";
        banner.style.top = "0";
        banner.style.left = "0";
        banner.style.width = "100%";
        banner.style.padding = "10px";
        banner.style.textAlign = "center";
        banner.style.color = "white";
        banner.style.background = dias <= 5 ? "red" : "#000080";
        banner.style.zIndex = "9999";
        banner.innerHTML = `Acceso activo | ${usuario.nombre} | ${dias} días restantes`;

        document.body.appendChild(banner);

        document.body.style.marginTop = "50px";
        document.body.style.display = "block";

    });

})();
