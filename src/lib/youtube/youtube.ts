// Extrai o id de um link do YouTube (watch?v=, youtu.be/, embed/)
export function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
    return match ? match[1] : null;
}

// Thumbnail estática de um vídeo do YouTube
export function getYouTubeThumbnail(url: string): string | null {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

interface YouTubeEmbedOptions {
    autoplay?: boolean;
    mute?: boolean;
    loop?: boolean;
    controls?: boolean;
}

// Monta a URL de embed do YouTube com visual minimalista (sem sugestões, marca reduzida, sem anotações)
export function getYouTubeEmbedUrl(id: string, options: YouTubeEmbedOptions = {}): string {
    const { autoplay = false, mute = false, loop = false, controls = true } = options;

    const params = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        iv_load_policy: "3",
        playsinline: "1",
        disablekb: "1",
        controls: controls ? "1" : "0",
    });

    if (autoplay) params.set("autoplay", "1");
    if (mute) params.set("mute", "1");
    if (loop) {
        params.set("loop", "1");
        params.set("playlist", id);
    }

    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
