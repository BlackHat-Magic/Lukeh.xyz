document.addEventListener ('alpine:init', () => {
    Alpine.data ('main', () => ({
       vecu: [0, 0, 0],
       vecv: [0, 0, 0],
       vecw: [0, 0, 0],

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
        },

        crossProduct(vecu, vecv) {
            vecw =  [0, 0, 0];
            vecw[0] = vecu[1] * vecv[2] - vecu[2] * vecv[1];
            vecw[1] = vecu[2] * vecv[0] - vecu[0] * vecv[2];
            vecw[2] = vecu[0] * vecv[1] - vecu[1] * vecv[0];
            return(vecw);
        },

        TSP(vecu, vecv, vecw) {
            return(this.dotProduct(vecu, this.crossProduct(vecv, vecw)));
        }
    }))
})
