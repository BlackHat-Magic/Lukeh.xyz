document.addEventListener ('alpine:init', () => {
    Alpine.data ('main', () => ({
       values: [0, 0, 0],

       scalar: 1,

       result () {
            result = [];
            for (let i = 0; i < this.values.length; i++) {
                result.push(this.values[i] * this.scalar);
            }
            console.log(result);
            return(result);
        }
    }))
})
