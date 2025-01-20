"use strict";
 
import Booking from "./booking.js";

//Classe che gestisce le prenotazioni
class BookingManager { 
   
    //ritorna tutte le prenotazioni di un determinato utente
    static getBookingsFromUserId = async (user_id) => {
        let response = await fetch(`/api/bookings?user_id=${user_id}`);
        const bookingJson = await response.json();

        if (response.ok) {
            const bookings = bookingJson.map( book => Booking.from(book));
            return bookings;
        } 
        else {
            throw bookingJson;
        }
    }
  
    //ritorna una prenotazione dato il suo id
    static getBookingById = async (id) => { 
        let response = await fetch(`/api/bookings/${id}`);
        const bookingJson = await response.json();

        if (response.ok) {
            const booking = Booking.from(bookingJson);
            return booking;
        } 
        else {
            throw bookingJson;
        } 
    }
 
    //aggiunge una prenotazione alla lista
    static addBooking = async (booking) => { 
        let response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(booking), //trasforma l'oggetto prenotazione in json
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

    //cancella una prenotazione dato l'id
    static deleteBooking = async (id) => {
        let response = await fetch(`/api/bookings/${id}`, {
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

export default BookingManager;