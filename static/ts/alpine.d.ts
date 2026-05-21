interface AlpineRefs {
    [key: string]: HTMLElement | undefined;
}

interface ShowdownConverter {
    makeHtml(text: string): string;
}

interface ShowdownStatic {
    new(options?: Record<string, unknown>): ShowdownConverter;
}

declare const Alpine: {
    data<T extends object>(name: string, component: () => T): void;
    store<T extends object>(name: string, store?: T): T;
};
declare const showdown: { Converter: ShowdownStatic };
