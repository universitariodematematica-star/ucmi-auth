(function () {

    /* =========================
       🔐 BASE DE USUARIOS (FUENTE DE VERDAD)
    ========================= */

    const estudiantes = {
        "123": { nombre: "Licencia 6 meses", expira: "2026-10-06T00:00:00Z" },
        "456": { nombre: "Licencia 6 meses", expira: "2026-10-06T00:00:00Z" },
        "789": { nombre: "Licencia 1 año", expira: "2027-04-06T00:00:00Z" },
        "012": { nombre: "Licencia 1 año", expira: "2027-04-06T00:00:00Z" }
    };

    /* =========================
       💾 PUBLICAR BASE (CLAVE DEL SISTEMA)
       → esto es lo que te faltaba
    ========================= */
    localStorage.setItem("db_estudiantes", JSON.stringify(estudiantes));

    /* =========================
       🔧 UTILIDADES
    ========================= */

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
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

        /* ❌ sin datos */
        if (!codigo || !session) {
            bloquear("Acceso no autorizado");
            return;
        }

        /* 📦 cargar base desde AUTH */
        const db = JSON.parse(localStorage.getItem("db_estudiantes") || "{}");

        /* ❌ código inválido */
        if (!db[codigo]) {
            bloquear("Código inválido");
            return;
        }

        const usuario = db[codigo];

        /* ❌ expiración real (FUENTE DE VERDAD) */
        if (new Date() > new Date(usuario.expira)) {
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
        banner.innerHTML =
            `Acceso activo | ${usuario.nombre} | ${dias} días restantes`;

        document.body.appendChild(banner);

        document.body.style.marginTop = "50px";
        document.body.style.display = "block";

    });

})();
