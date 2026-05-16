document.addEventListener("alpine:init", () => {
    Alpine.data("main", () => ({
        converter: new showdown.Converter({ tables: true }),

        convert(this: { converter: ShowdownConverter }, text: string): string {
            return this.converter.makeHtml(text.split("]][[").join("`"));
        },
    }));
});
