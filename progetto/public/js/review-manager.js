"use strict";
 
import Review from "./review.js";

//Classe che gestisce le recensioni
class ReviewManager {

    constructor() {
        this.reviews = [];  
    } 
 
    //ritorna tutte le recensioni
    static getAllReviews = async () => {
        let response = await fetch("/api/reviews");
        const reviewsJson = await response.json();

        if(response.ok) { //se la risposta è un 200 OK
            //converte il json in oggetti Review e mappa nella lista this.reviews
            this.reviews = reviewsJson.map( rev => Review.from(rev));
            
            //ritorna la lista delle recensioni
            return this.reviews;

        } 
        else {
            throw reviewsJson;
        }
    } 
 
    //ritorna una recensione dato l'id
    // static getReviewById = async (id) => {
    //     let response = await fetch(`/api/reviews/${id}`);
    //     const reviewsJson = await response.json();

    //     if (response.ok) {
    //         const review = Review.from(reviewsJson);
    //         return review;
    //     } 
    //     else {
    //         throw reviewsJson;
    //     }
    // }

    //aggiunge una recensione alla lista
    static addReview = async (review) => {

        let response = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(review), //trasforma l'oggetto review in json
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

export default ReviewManager;