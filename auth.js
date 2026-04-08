(function() {

    function getCookie(nombre) {
        const match = document.cookie.match(new RegExp('(^| )' + nombre + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function limpiarCookies() {
        document.cookie = "codigo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "expiracion=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    function bloquearAcceso(mensaje) {
        document.body.innerHTML = "<h2 style='text-align:center;margin-top:50px;'>" + mensaje + "</h2>";
        setTimeout(() => {
            window.location.href = "https://universitariocmi.blogspot.com/2024/08/portal-de-autenticacion-ucmi-a1.html";
        }, 3000);
    }

    function calcularDiasRestantes(fechaExp) {
        const ahora = new Date();
        const exp = new Date(fechaExp);
        const diff = exp - ahora;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

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

    // Usuario válido
    const dias = calcularDiasRestantes(expiracion);

    console.log("Acceso válido. Días restantes:", dias);

})();
