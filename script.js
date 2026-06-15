document.getElementById('btn-check').addEventListener('click', checkServer);
document.getElementById('server-ip').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkServer();
});

async function checkServer() {
    const ipInput = document.getElementById('server-ip').value.trim();
    const card = document.getElementById('result-card');
    
    // Contenedores de estados
    const stateIdle = document.getElementById('state-idle');
    const stateLoading = document.getElementById('state-loading');
    const stateSuccess = document.getElementById('state-success');
    const stateError = document.getElementById('state-error');

    if (!ipInput) return;

    // Cambiar visualización a estado "Cargando"
    card.className = "api-result-card loading-status";
    stateIdle.classList.add('hidden');
    stateSuccess.classList.add('hidden');
    stateError.classList.add('hidden');
    stateLoading.classList.remove('hidden');

    try {
        // Consultar la API pública y gratuita de mcsrvstat.us
        const response = await fetch(`https://api.mcsrvstat.us/2/${ipInput}`);
        if (!response.ok) throw new Error();
        
        const data = await response.json();

        // Ocultar spiner de carga
        stateLoading.classList.add('hidden');

        if (data.online) {
            // Servidor ONLINE
            card.className = "api-result-card online-status";
            
            document.getElementById('res-hostname').textContent = data.hostname || ipInput;
            
            const badge = document.getElementById('res-status-badge');
            badge.className = "status-badge online";
            badge.innerHTML = '<i class="fas fa-check-circle"></i> Online';

            document.getElementById('res-ip').textContent = `${data.ip}:${data.port}`;
            document.getElementById('res-players').textContent = `${data.players.online} / ${data.players.max}`;
            document.getElementById('res-version').textContent = data.version || 'Desconocida';
            
            // Muestra las líneas limpias del MOTD decodificadas sin códigos raros de color
            const motdText = data.motd && data.motd.clean ? data.motd.clean.join('\n') : 'Sin descripción';
            document.getElementById('res-motd-clean').textContent = motdText;

            stateSuccess.classList.remove('hidden');
        } else {
            // Servidor OFFLINE
            card.className = "api-result-card offline-status";
            
            document.getElementById('res-hostname').textContent = ipInput;
            
            const badge = document.getElementById('res-status-badge');
            badge.className = "status-badge offline";
            badge.innerHTML = '<i class="fas fa-times-circle"></i> Offline';

            document.getElementById('res-ip').textContent = ipInput;
            document.getElementById('res-players').textContent = '0 / 0';
            document.getElementById('res-version').textContent = '-';
            document.getElementById('res-motd-clean').textContent = 'No se ha podido establecer comunicación con el host.';

            stateSuccess.classList.remove('hidden');
        }

    } catch (err) {
        // Captura fallos de red o errores internos de la API
        card.className = "api-result-card offline-status";
        stateLoading.classList.add('hidden');
        stateError.textContent = "Error al conectar con el servidor de telemetría. Revisa el formato.";
        stateError.classList.remove('hidden');
    }
}