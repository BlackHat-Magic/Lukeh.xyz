document.addEventListener ("alpine:init", () => {
    Alpine.data ("TitleTyping", () => ({
        text: '⁣',
        textArray : ['Luke Henderson', 'Undergraduate Student', 'Graphics and AI Developer'],
        textIndex: 0,
        charIndex: 0,
        typeSpeed: 110,
        cursorSpeed: 550,
        pauseEnd: 1500,
        pauseStart: 20,
        direction: 'forward',
        init_function () {
			const startTyping = () => {
				let current = this.textArray[ this.textIndex ];
				
				// check to see if we hit the end of the string
				if(this.charIndex > current.length){
						this.direction = 'backward';
						clearInterval(typingInterval);
						
						setTimeout(() => {
							typingInterval = setInterval(startTyping, this.typeSpeed);
						}, this.pauseEnd);
				}   
					
				this.text = current.substring(0, this.charIndex) || "⁣";
				
				if(this.direction == 'forward')
				{
					this.charIndex += 1;
				} 
				else 
				{
					if(this.charIndex == 0)
					{
						this.direction = 'forward';
						clearInterval(typingInterval);
						setTimeout(() => {
							this.textIndex += 1;
							if(this.textIndex >= this.textArray.length)
							{
								this.textIndex = 0;
							}
							typingInterval = setInterval(startTyping, this.typeSpeed);
						}, this.pauseStart);
					}
					this.charIndex -= 1;
				}
			};

			let typingInterval = setInterval(startTyping, this.typeSpeed);
						
			setInterval(function(){
				if(document.querySelector("#cursor").classList.contains('hidden'))
				{
					document.querySelector("#cursor").classList.remove('hidden');
				} 
				else 
				{
					document.querySelector("#cursor").classList.add('hidden');
				}
			}, this.cursorSpeed);
        }
    }))
})