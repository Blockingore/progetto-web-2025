"use strict";

class Offer {
 
    constructor(id=undefined, nome, citta, indirizzo, tipo, ospiti, descrizione, datainizio, datafine, costo, img) {
        this.id = id;
        this.nome = nome;
        this.citta = citta;
        this.indirizzo = indirizzo; 
        this.tipo = tipo;
        this.ospiti = ospiti;
        this.descrizione = descrizione;
        this.datainizio = moment(datainizio);
        this.datafine = moment(datafine);
        this.costo = costo;
        this.img = img;
    }

    //METODI
    static from(json) { //prende un json e ritorna un oggetto di tipo Offer
        const offer = Object.assign(new Offer(), json);

        //converte il tipo di data da string (del json) a moment
        offer.datainizio = moment(offer.datainizio); 
        offer.datafine = moment(offer.datafine);
        return offer;
    }
}

export default Offer;