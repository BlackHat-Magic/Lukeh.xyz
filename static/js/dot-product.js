document.addEventListener ('alpine:init', () => {
    Alpine.data ('main', () => ({
       vecu: [0, 0, 0],
       vecv: [0, 0, 0],

        decrement () {
            if(this.vecu.length <= 1) {
                alert("...");
            } else {
                this.vecu.pop();
                this.vecv.pop();
            }
        },

        increment () {
            this.vecu.push(0);
            this.vecv.push(0);
        },

        dotProduct(vecu, vecv) {
            vecw =  0;
            for (let i = 0; i < vecu.length; i ++) {
                vecw += parseInt(vecu[i]) * parseInt(vecv[i]);
            }
            return(vecw);
        }
    }))
})
