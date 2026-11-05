const RELOADED_KEY = 'chunk-reload-at'
const RETRY_AFTER_MS = 60_000

// Depois de um deploy, a aba aberta ainda aponta para arquivos que não existem
// mais. Recarrega uma vez para buscar a versão nova; a janela de tempo evita
// loop infinito se o arquivo estiver mesmo indisponível.
function handlePreloadError(event: Event) {
    try {
        const last = Number(sessionStorage.getItem(RELOADED_KEY)) || 0
        if (Date.now() - last < RETRY_AFTER_MS) return
        sessionStorage.setItem(RELOADED_KEY, String(Date.now()))
    } catch {
        return
    }
    event.preventDefault()
    window.location.reload()
}

export function reloadOnStaleChunk() {
    window.addEventListener('vite:preloadError', handlePreloadError)
}
