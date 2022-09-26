document.addEventListener ('alpine:init', () => {
    Alpine.data('vecNumber', () => ({
        value: 2,

        numsub () {
            if ( this.value <= 1 ){
                alert("Stop that.");
            } else {
                this.value --;
            }
        },

        numadd () {
            this.value ++;
        },
    }))
    Alpine.data ('dimensions', () => ({
        value: 3,
        
        numsub () {
            if ( this.value <= 1 ) {
                alert("You think you're funny?")
            } else {
                this.value --;
            }
        },

        numadd () {
            this.value ++;
        }
    }))
})


