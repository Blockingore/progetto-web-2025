"use strict";
 
import Offer from "./offer.js";

//Classe che gestisce la lista delle offerte
class OfferManager {

    constructor() { 
        this.offers = [];  
    } 
 
    //ritorna tutte le offerte (riempie la lista delle offerte)
    static getAllOffers = async () => {
        let response = await fetch("/api/offers");
        const offersJson = await response.json();

        if(response.ok) {
            //Converte il json in oggetti Offer e mappa nella lista this.offers
            this.offers = offersJson.map( off => Offer.from(off));
            
            //ritorna la lista delle offerte
            return this.offers;

        } 
        else {
            throw offersJson;
        }
    } 

    //ritorna tutte le offerte filtrate con una query url (es: http://localhost:3000/offers?location=Milano&tipo=Hotel&ospiti=2&start=2023-09-12&end=2023-09-13 )
    static getFilteredOffers = async (query) => {
        
        let response = await fetch(`/api/offers?${query}`);
        const offersJson = await response.json();

        if(response.ok) {
            this.offers = offersJson.map( off => Offer.from(off)); 
            return this.offers;

        } 
        else {
            throw offersJson;
        } 
    }  
    
    //ritorna un'offerta dato l'id
    static getOfferById = async (id) => {
        let response = await fetch(`/api/offers/${id}`);
        const offerJson = await response.json();

        if (response.ok) {
            const offer = Offer.from(offerJson); 
            return offer;
        } else {
            throw offerJson;
        }
    }
 
    //aggiunge un'offerta alla lista
    static addOffer = async (offer) => {

        let response = await fetch("/api/offers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(offer), //trasforma l'oggetto offer in json
        });
        if(response.ok) { 
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
            catch(err) {
                if(Array.isArray(err)) {
                    let errors = "";
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for "${e.param}", `);
                    throw `Error: ${errors}`;
                }
                else
                    throw "Error: cannot parse server response";
            }
        }
    }  

    //modifico un'offerta
    static updateOffer = async (offer) => {
        let response = await fetch(`/api/offers/${offer.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(offer),
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
            catch(err) {
                if(Array.isArray(err)) {
                    let errors = "";
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                }
                else
                    throw "Error: cannot parse server response";
            }
        }
    }

    //cancella un'offerta 
    static deleteOffer = async (id) => {
        let response = await fetch(`/api/offers/${id}`, {
            method: "DELETE",
        });
        if(response.ok) {  
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
            catch(err) {
                if(Array.isArray(err)) {
                    let errors = "";
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for "${e.param}", `);
                    throw `Error: ${errors}`;
                }
                else
                    throw "Error: cannot parse server response";
            }
        }
    }
}             

export default OfferManager;