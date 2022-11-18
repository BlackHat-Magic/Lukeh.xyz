document.addEventListener ("alpine:init", () => {
    Alpine.data ("main", () => ({
        name: "",
        category: "",
        text: "",

        converter: new showdown.Converter({tables: true}),

        convert(text) {
            return(this.converter.makeHtml(text))
        }
    }))
})
