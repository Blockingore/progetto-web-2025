"use strict";

/*DAO (Data Access Object) 
Contiene le implementazioni delle REST API */ 
const sqlite = require("sqlite3"); 
const moment = require("moment");

const db = new sqlite.Database("project.db", (err) => {
    if (err) throw err;
});


/*========================================================*/
/*=================== REST API OFFERTE ===================*/
/*========================================================*/

//Recuperare tutte le offers (con eventuale filtro. es: http://localhost:3000/offers?location=Milano&tipo=Hotel&ospiti=2&start=2023-09-12&end=2023-09-13 )
exports.getOffers = function(filter) { 
    return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM offerte";
    let params = [];

    //se c'è una query di filtraggio nell'url
    if(filter && typeof filter === "object" && Object.keys(filter).length > 0) {
        //per ogni key del filtro (città, tipo, ospiti e date), l'aggiungo a params
        for(const key in filter) {
            if(key === "location" && filter[key]) {
                const location = filter[key].trim().toLowerCase(); //rende la ricerca case-insensitive (qualsiasi valore viene convertito in minuscolo prima di fare la query sql)
                params.push(`(citta = "${location}" OR nome = "${location}")`);
            } 
            else if(key === "tipo" && filter[key]) {
                params.push(`tipo = "${filter[key]}"`);
            } 
            else if(key === "ospiti" && filter[key]) {
                params.push(`ospiti = ${filter[key]}`);
            } 
            else if(key === "start" && filter[key]) {
                params.push(`datainizio <= "${filter.end}" AND datafine >= "${filter[key]}"`);
            } 
            else if(key === "end" && filter[key]) {
                params.push(`datainizio <= "${filter[key]}" AND datafine >= "${filter.start}"`);
            }
        }

        //concatena con l'operatore AND tutti i params alla stringa sql, che poi verrà data al db
        if(params.length > 0) {
            sql += ` WHERE ${params.join(" AND ")}`;
        }
    } 
    
    db.all(sql, (err, rows) => {
        if(err) {
            reject(err);
            return;
        }

        let offers = rows.map((t) => ({
            id: t.id,
            nome: t.nome,
            citta: t.citta,
            indirizzo: t.indirizzo,
            tipo: t.tipo,
            ospiti: t.ospiti,
            descrizione: t.descrizione,
            datainizio: moment(t.datainizio),
            datafine: moment(t.datafine),
            costo: t.costo,
            img: t.img
        }));

            resolve(offers);
        });
    });
};
   
//Restituisce una offer dato l'id 
exports.getOfferById = function(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM offerte WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            
            if(row === undefined) {
                resolve({error: "Offer not found"});
            } else {
                resolve(row);
            }
        });
    });
};

//Inserisce una nuova offer
exports.createOffer = function(offer) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO offerte(nome, citta, indirizzo, tipo, ospiti, descrizione, datainizio, datafine, costo, img) VALUES (?, ?, ?, ?, ?, ?, DATETIME(?), DATETIME(?), ?, ?)";
        db.run(sql, [offer.nome, offer.citta, offer.indirizzo, offer.tipo, offer.ospiti, offer.descrizione, offer.datainizio, offer.datafine, offer.costo, offer.img], function(err) {
            if(err) {
                reject(err);
            } 
            else {
                resolve(this.lastID);
            }
        });
    });
};

//Aggiorna una offer dato l'id
exports.updateOfferById = function(id, newInfo) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE offerte SET nome=?, citta=?, indirizzo=?, tipo=?, ospiti=?, descrizione=?, datainizio=DATETIME(?), datafine=DATETIME(?), costo=?, img=? WHERE id=?";
        db.run(sql, [newInfo.nome, newInfo.citta, newInfo.indirizzo, newInfo.tipo, newInfo.ospiti, newInfo.descrizione, newInfo.datainizio, newInfo.datafine, newInfo.costo, newInfo.img, id], function (err) {
            if(err) {
                reject(err);
            } 
            else if (this.changes === 0) //se non ho aggiornato perchè non esiste l'id
                resolve({error: "Offer not found"});
            else {
                resolve();
            }
        })
    });
}

//Cancella una offer dato l'id
exports.deleteOffer = function(id) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM offerte WHERE id = ?";
        db.run(sql, [id], function(err) {
            if(err)
                reject(err);
            else if(this.changes === 0) //se non ho eliminato nulla
                resolve({error: "Offer not found"});
            else {
                resolve();
            }
        });
    });
}


/*========================================================*/
/*================= REST API RECENSIONI ==================*/
/*========================================================*/

//Recuperare tutte le recensioni
exports.getReviews = function() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM recensioni";

        //fa la ricerca nel db
        db.all(sql, (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            let reviews = rows.map((t) => ({
                id: t.id,
                autore: t.autore,
                img: t.img,
                stelle: t.stelle,
                titolo: t.titolo,
                testo: t.testo
            }));

            resolve(reviews);
        });
    });
};

//Restituisce una review dato l'id 
exports.getReviewById = function(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM recensioni WHERE id=?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            
            if(row === undefined) {
                resolve({error: "Review not found"});
            } else {
                resolve(row);
            }
        });
    });
};

//Inserisce una nuova review
exports.createReview = function(review) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO recensioni(autore, img, stelle, titolo, testo) VALUES (?, ?, ?, ?, ?)";
        db.run(sql, [review.autore, review.img, review.stelle, review.titolo, review.testo], function(err) {
            if (err) {
                reject(err);
            } 
            else {
                resolve(this.lastID);
            }
        });
    });
};


/*========================================================*/
/*================= ROUTES PRENOTAZIONI ==================*/
/*========================================================*/
  
//Restituisce le prenotazioni dato l'id dell'utente
exports.getBookingsByUserId = function(userId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM prenotazioni WHERE user_id = ?";
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            
            if(rows === undefined) {
                resolve({error: "Booking not found"});
            } 
            else {
                resolve(rows);
            }
        });
    });
};

//Inserisce una nuova prenotazione
exports.createBooking = function(booking) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO prenotazioni(nome, citta, indirizzo, tipo, ospiti, descrizione, datainizio, datafine, costo, img, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.run(sql, [booking.nome, booking.citta, booking.indirizzo, booking.tipo, booking.ospiti, booking.descrizione, booking.datainizio, booking.datafine, booking.costo, booking.img, booking.user_id], function(err) {
            if (err) {
                reject(err);
            } 
            else {
                resolve(this.lastID);
            }
        });
    });
};

//Restituisce una prenotazione dato l'id 
exports.getBookingById = function(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM prenotazioni WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            
            if(row === undefined) {
                resolve({error: "Booking not found"});
            } 
            else {
                resolve(row);
            }
        });
    });
};

//Cancella una prenotazione dato l'id
exports.deleteBooking = function(id) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM prenotazioni WHERE id = ?";
        db.run(sql, [id], function(err) {
            if(err)
                reject(err);
            else if(this.changes === 0) //Se non ho eliminato nulla
                resolve({error: "Booking not found"});
            else {
                resolve();
            }
        });
    });
}