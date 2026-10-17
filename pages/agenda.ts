import agendaUrl from '../assets/agenda.json?url';

const images = import.meta.glob('/assets/agenda/*.jpg', { eager: true, import: 'default' });

type Entry = {
    date: string;
    event: string;
    eventUrl: string;
    location: string;
    geo: [number, number];
    omapsUrl: string;
};

const compareByDate = (a: Entry, b: Entry) => {
    const titles = [a.date, b.date];
    if (titles[0] > titles[1]) return -1;
    if (titles[0] < titles[1]) return 1;
    return 0;
}

const init = () => {
    const agenda = document.querySelector('#agenda');
    const entryTpl = document.querySelector<HTMLTemplateElement>("#entry");
    if (!agenda || !entryTpl)
        throw new Error('Agenda el or item template does not exist');

    const updateList = (data: Entry[]) => {
        data
            .sort(compareByDate)
            .map((entry, i) => {
                const tpl = entryTpl.content.cloneNode(true) as HTMLTemplateElement;
                tpl.querySelector('[data-index]')!.textContent = String(i + 1);

                const eventLink = tpl.querySelector('[data-event] a') as HTMLAnchorElement;
                eventLink.textContent = entry.event;
                if (entry.eventUrl) eventLink.href = entry.eventUrl;

                tpl.querySelector('[data-date]')!.textContent =
                    new Intl.DateTimeFormat('en-GB').format(new Date(entry.date));

                const imgUrl = images["/assets/agenda/" + entry.date + '.jpg'];
                if (imgUrl) {
                    const img = tpl.querySelector('[data-image] img') as HTMLImageElement;
                    img.src = imgUrl;
                }

                const locationLink = tpl.querySelector('[data-place] a') as HTMLAnchorElement;
                locationLink.textContent = entry.location;
                if (entry.omapsUrl) locationLink.href = entry.omapsUrl;

                return tpl;
            })
            .forEach(li => agenda.appendChild(li));
    };

    fetch(agendaUrl)
        .then(res => res.json())
        .then(updateList);
};

document.addEventListener('DOMContentLoaded', init);
