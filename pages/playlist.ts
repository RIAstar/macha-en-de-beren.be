import playlistUrl from '../assets/playlist.json?url';

type Song = {
    song: string;
    artist: string;
    status: Status;
    keys: string[];
    bpm: number;
    instruments: string[];
};

type Status =
    | 'rotating'
    | 'on-hold'
    | 'out'
    | 'study';

const statusOrder = ['study', 'on-hold', 'out', 'rotating'] satisfies Status[];

const compareByTitle = (a: Song, b: Song) => {
    const titles = [a.song, b.song].map(s => s.replace(/'/g, '').toLowerCase());
    if (titles[0] > titles[1]) return 1;
    if (titles[0] < titles[1]) return -1;
    return 0;
}

const accidentalSymbol = {
    sharp: '♯',
    flat: '♭'
};

const init = () => {
    const playlist = document.querySelector('#playlist');
    const backlog = document.querySelector('#backlog');
    const compactTpl = document.querySelector<HTMLTemplateElement>("#song-compact");
    const fullTpl = document.querySelector<HTMLTemplateElement>("#song-full");
    if (!playlist || !backlog || !compactTpl || !fullTpl)
        throw new Error('Playlist el or item template does not exist');

    const updateList = (data: Song[]) => {
        data = data.map(song => ({
            ...song,
            keys: song.keys.map(key => {
                const parts = key.split('-');
                const [note] = parts;
                const accidental = accidentalSymbol[parts.length === 2 ? '' : parts[1]] ?? '';
                const quality = parts[2] ?? parts[1];

                return {
                    full: `${note.toUpperCase()}${accidental} ${quality}`,
                    short: `${note.toUpperCase()}${accidental}${quality === 'major' ? '' : 'm'}`,
                };
            })
        }));

        data
            .sort(compareByTitle)
            .filter(({ status }) => status === 'rotating')
            .map(song => {
                const tpl = compactTpl.content.cloneNode(true) as HTMLTemplateElement;
                tpl.querySelector('[data-title]')!.textContent = song.song;
                tpl.querySelector('[data-artist]')!.textContent = song.artist;
                return tpl;
            })
            .forEach(li => playlist.appendChild(li));

        data
            .sort((a, b) => {
                if (a.status === b.status) return compareByTitle(a, b);
                return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
            })
            .map((song, i) => {
                const tpl = fullTpl.content.cloneNode(true) as HTMLTemplateElement;
                tpl.querySelector('[data-index]')!.textContent = i + 1;
                tpl.querySelector('[data-title]')!.textContent = song.song;
                tpl.querySelector('[data-artist]')!.textContent = song.artist;
                tpl.querySelector('[data-status-label]')!.textContent = song.status;
                tpl.querySelector('[data-status]')!.setAttribute('data-status', song.status);
                tpl.querySelector('[data-full-keys]')!.textContent = song.keys.map(x => x.full).join(', ');
                tpl.querySelector('[data-short-keys]')!.textContent = song.keys.map(x => x.short).join(', ');
                tpl.querySelector('[data-bpm]')!.textContent = song.bpm.toString();
                tpl.querySelector('[data-instruments]')!.textContent = song.instruments.join(', ') || 'standard';
                return tpl;
            })
            .forEach(li => backlog.appendChild(li));
    };

    fetch(playlistUrl)
        .then(res => res.json())
        .then(updateList);
};

document.addEventListener('DOMContentLoaded', init);
