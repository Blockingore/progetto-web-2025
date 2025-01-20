"use strict";

import Offer from "./offer.js";

class Booking extends Offer {
 
    constructor(id=undefined, nome, citta, indirizzo, tipo, ospiti, descrizione, datainizio, datafine, costo, img, user_id) {
        super(id, nome, citta, indirizzo, tipo, ospiti, descrizione, datainizio, datafine, costo, img);
        this.user_id = user_id;
    }

    //METODI
    static from(json) { //prende un json e ritorna un oggetto di tipo Booking
        const book = Object.assign(new Booking(), json);

        //converte il tipo di data da string (del json) a moment
        book.datainizio = moment(book.datainizio); 
        book.datafine = moment(book.datafine);
        return book;
    }
}

export default Booking;