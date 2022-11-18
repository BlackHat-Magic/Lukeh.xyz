document.addEventListener ('alpine:init', () => {
    Alpine.data ('main', () => ({
       values: [0, 0, 0],

       magnitude () {
            magnitude = 0;
            for (let i = 0; i < this.values.length; i++) {
                magnitude += this.values[i] * this.values[i];
            }
            magnitude = Math.sqrt(magnitude);
            return(magnitude);
        },

        result () {
            result = new Array();
            for (let i = 0; i < this.values.length; i++) {
                result.push(Math.round(this.values[i] / this.magnitude() * 100000) / 100000);
            }
            return(result);
        }
    }))
})
