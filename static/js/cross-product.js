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

        crossProduct(vecu, vecv) {
            vecw =  [];
            vecw[0] = vecu[1] * vecv[2] - vecu[2] * vecv[1];
            vecw[1] = vecu[2] * vecv[0] - vecu[0] * vecv[2];
            vecw[2] = vecu[0] * vecv[1] - vecu[1] * vecv[0];
            return(vecw);
        }
    }))
})
