document.addEventListener("alpine:init", () => {
    const titleTyping = {
        text: "\u2063",
        textArray: ["Luke Henderson", "Undergraduate Student", "Graphics and AI Developer"],
        textIndex: 0,
        charIndex: 0,
        typeSpeed: 110,
        cursorSpeed: 550,
        pauseEnd: 1500,
        pauseStart: 20,
        direction: "forward" as "forward" | "backward",
        init_function(): void {
            const startTyping = (): void => {
                const current = this.textArray[this.textIndex];

                if (this.charIndex > current.length) {
                    this.direction = "backward";
                    clearInterval(typingInterval);

                    setTimeout(() => {
                        typingInterval = setInterval(startTyping, this.typeSpeed);
                    }, this.pauseEnd);
                }

                this.text = current.substring(0, this.charIndex) || "\u2063";

                if (this.direction === "forward") {
                    this.charIndex += 1;
                } else {
                    if (this.charIndex === 0) {
                        this.direction = "forward";
                        clearInterval(typingInterval);
                        setTimeout(() => {
                            this.textIndex += 1;
                            if (this.textIndex >= this.textArray.length) {
                                this.textIndex = 0;
                            }
                            typingInterval = setInterval(startTyping, this.typeSpeed);
                        }, this.pauseStart);
                    }
                    this.charIndex -= 1;
                }
            };

            let typingInterval = setInterval(startTyping, this.typeSpeed);

            setInterval(() => {
                const cursor = document.querySelector<HTMLElement>("#cursor");
                if (cursor) {
                    cursor.classList.toggle("hidden");
                }
            }, this.cursorSpeed);
        },
    };

    Alpine.data("TitleTyping", () => titleTyping);
});
