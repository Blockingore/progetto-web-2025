"use strict";

class Review {
 
    constructor(id=undefined, autore, img, stelle, titolo, testo) {
        this.id = id;
        this.autore = autore;
        this.img = img;
        this.stelle = stelle;
        this.titolo = titolo;
        this.testo = testo; 
    }

    //METODI
    static from(json) { //prende un json e ritorna un oggetto di tipo Review
        const rev = Object.assign(new Review(), json);
        return rev;
    }
}

export default Review;