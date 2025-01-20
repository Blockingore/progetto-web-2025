"use strict";

import OfferManager from "./offer-manager.js";
import Offer from "./offer.js";
import ReviewManager from "./review-manager.js";
import Review from "./review.js";
import UserManager from "./user-manager.js";
import User from "./user.js";
import BookingManager from "./booking-manager.js";
import Booking from "./booking.js";
import createHomePage from "./templates/home-template.js";
import {createOffersPage, createOfferListItem} from "./templates/offers-template.js";
import createOffersFormPage from "./templates/offersform-template.js";
import {createReviewsPage, createReviewListItem} from "./templates/reviews-template.js";
import createReviewsFormPage from "./templates/reviewsform-template.js";
import {createLoginFormPage, createSignupFormPage, createLoginSignupLinks, createProfileExitLinks} from "./templates/auth-template.js"; 
import {createProfilePage, createBookingListItem} from "./templates/profile-template.js";
import createAlert from "./templates/alert-template.js";
import page from "//unpkg.com/page/page.mjs";

class App {

    constructor(appContainer) {
        //riferimento all main HTML page-content
        this.appContainer = appContainer;

        //ROTTE:
        page("/", () => {
            this.updateUserArea();
            //crea la homepage 
            this.appContainer.innerHTML = createHomePage();
        });
        page("/offers", async (ctx) => { 
            this.updateUserArea();
            //crea la pagina offerte
            this.appContainer.innerHTML = createOffersPage();
        
            if (!ctx.querystring || Object.keys(ctx.querystring ).length === 0 ) {
                //se la url query è vuota, mostra tutte le offerte
                this.showAllOffers();
            } 
            else {
                //altrimenti, mostra le offerte filtrate 
                this.showFilteredOffers(ctx.querystring);
            }
        });
        page("/offers/add", () => { 
            this.updateUserArea();
            //crea il form di add/edit offerta (add)
            this.showAddEditForm();
        });
        page("/offers/:id/edit", (ctx) => {
            this.updateUserArea();
            //crea il form di add/edit, passando id come parametro (edit)
            this.showAddEditForm(ctx.params.id);
        });
        page("/reviews", () => {
            this.updateUserArea();
            //crea la pagina recensioni
            this.appContainer.innerHTML = createReviewsPage();
            //mostra la lista di recensioni
            this.showReviews();
        });
        page("/reviews/add", () => {
            this.updateUserArea();
            //crea il form di aggiunta recensione
            this.showReviewForm(); 
        });
        page("/login", () => {
            this.updateUserArea();
            //crea il form di login
            this.showLoginForm();
        });
        page("/profile", () => {
            this.updateUserArea();

            const user = JSON.parse(localStorage.getItem("user"));
            if(user) {
                //se un utente è loggato mostra la pagina del profilo
                this.showProfilePage(user); 
            } else {
                //altrimenti reindirizza l'utente anonimo alla pagina di accesso
                page("/login");
            }
        });
        page("/signup", () => {
            this.updateUserArea();
            //crea il form di signup
            this.showSignupForm();
        });
        page("/logout", () => {
            this.updateUserArea();
            this.logout();
        });
        page("*", () => { 
            page("/"); 
            //comunica l'alert, dopo aver dato il tempo al redirect
            setTimeout(() => {
                alert("Pagina inesistente!")
            }, 100);
        });
        page(); 
    } 
 
    
    //funzione che tiene aggiornata la user-area (controlla se un user è loggato o no)
    updateUserArea() {
        const userArea = document.getElementById("user-area");
        const user = JSON.parse(localStorage.getItem("user"));

        if(user) {
            userArea.innerHTML = createProfileExitLinks(user);
        }
        else {
            userArea.innerHTML = createLoginSignupLinks();
        }
    }


    /*-------------------- Offerte ---------------------------*/
    
    //popola la offer-list <ul> delle offerte con tutte le offerte
    showAllOffers = async () => {   
        try {
            const offers = await OfferManager.getAllOffers();
           
            const offerlist = document.querySelector("#offer-list");
            offerlist.innerHTML = ""; //svuota la lista prima di popolarla

            //per ogni offerta, crea un'offerListItem e lo inserisce nella offer-list
            for(const offer of offers) { 
                const offerListItem = createOfferListItem(offer);
                offerlist.insertAdjacentHTML("beforeend", offerListItem);
            }

            const user = JSON.parse(localStorage.getItem("user"));
            //se l'utente è loggato come admin
            if(user && user.tipouser === 1) { 
                //rendo visibili i bottoni da amministratore
                const editBtns = document.querySelectorAll(".edit-button");
                editBtns.forEach(btn => btn.classList.remove("invisible"));
                const deleteBtns = document.querySelectorAll(".delete-button");
                deleteBtns.forEach(btn => btn.classList.remove("invisible"));
                const addOfferBtn = document.getElementById("add-offer-button");
                addOfferBtn.classList.remove("invisible");

                //seleziona tutti i pulsanti di eliminazione e li rendo listener del click
                const deleteButtons = document.querySelectorAll(".delete-button");
                deleteButtons.forEach(button => {
                    button.addEventListener("click", async () => {
                        const listItem = button.closest(".offer-item");
                        listItem.remove();
                        //ottengo l'id dell'offerta da eliminare e la rimuovo dal db
                        const offerId = button.dataset.offerId;
                        try {
                            await OfferManager.deleteOffer(offerId);
                             
                            const alertMessage = document.getElementById("alert-messages");
                            alertMessage.innerHTML = createAlert("success-popup", "Offerta cancellata con successo!"); 
                            setTimeout(() => {
                                alertMessage.innerHTML = "";
                            }, 4000);
                        }
                        catch(error) {
                            console.error(error); 
                        };
                    });
                });
            } 

            //seleziona tutti i pulsanti di prenotazione e li rendo listener del click
            const bookingButtons = document.querySelectorAll(".book-button");
            bookingButtons.forEach(button => {
                button.addEventListener("click", async () => {
                    //se è un utente loggato a premere il bottone prenota
                    if(user) {
                        const listItem = button.closest(".offer-item");
                        listItem.remove();
                        //ottengo l'id dell'offerta da prenotare e chiamo onBookingSubmitted
                        const offerId = button.dataset.offerId;
                        try {
                            this.onBookingSubmitted(offerId);
                            
                            setTimeout(() => {
                                page("/profile");
                            }, 200); 

                            setTimeout(() => {
                                const alertMessage = document.getElementById("alert-messages");
                                alertMessage.innerHTML = createAlert("success-popup", "Offerta prenotata con successo!"); 
                                setTimeout(() => {
                                    alertMessage.innerHTML = "";
                                }, 4000);
                            }, 200); 
                        }
                        catch(error) {
                            console.error(error); 
                        };
                    }
                    else {
                        //altrimenti viene portato alla pagina login
                        page("/login");
                    }
                }); 
            });
        }
        catch(error) {
            console.error(error); 
        }
    }
 
    //popola la offer-list <ul> con le offerte filtrate
    showFilteredOffers = async (query) => {
        try {
            const filteredOffers = await OfferManager.getFilteredOffers(query);
           
            const offerlist = document.querySelector("#offer-list");
            offerlist.innerHTML = ""; //svuota la lista prima di popolarla

            if(filteredOffers.length === 0) {
                this.showAllOffers(); 

                setTimeout(() => {
                    const alertMessage = document.getElementById("alert-messages");
                    alertMessage.innerHTML = createAlert("alert-popup", "La ricerca non ha prodotto risultati! :("); 
                    setTimeout(() => {
                        alertMessage.innerHTML = "";
                    }, 4000);
                }, 200);
            }
            else {
                //per ogni offerta, crea un'offerListItem e lo inserisce nella offer-list
                for(const offer of filteredOffers) { 
                    const offerListItem = createOfferListItem(offer);

                    offerlist.insertAdjacentHTML("beforeend", offerListItem);
                }

                const user = JSON.parse(localStorage.getItem("user"));
                //se l'utente è loggato come admin
                if(user && user.tipouser === 1) {

                    //rendo visibili i bottoni da amministratore
                    const editBtns = document.querySelectorAll(".edit-button");
                    editBtns.forEach(btn => btn.classList.remove("invisible"));
                    const deleteBtns = document.querySelectorAll(".delete-button");
                    deleteBtns.forEach(btn => btn.classList.remove("invisible"));
                    const addOfferBtn = document.getElementById("add-offer-button");
                    addOfferBtn.classList.remove("invisible");

                    //seleziona tutti i pulsanti di eliminazione e li rendo listener del click
                    const deleteButtons = document.querySelectorAll(".delete-button");
                    deleteButtons.forEach(button => {
                        button.addEventListener("click", async () => {
                            const listItem = button.closest(".offer-item");
                            listItem.remove();
                            //ottengo l'id dell'offerta da eliminare e la rimuovo dal db
                            const offerId = button.dataset.offerId;
                            try {
                                await OfferManager.deleteOffer(offerId)
                                
                                const alertMessage = document.getElementById("alert-messages");
                                alertMessage.innerHTML = createAlert("success-popup", "Offerta cancellata con successo!"); 
                                setTimeout(() => {
                                    alertMessage.innerHTML = "";
                                }, 4000);
                            }
                            catch(error) {
                                console.error(error); 
                            };
                        });
                    }); 
                }
 
                //seleziona tutti i pulsanti di prenotazione e li rendo listener del click
                const bookingButtons = document.querySelectorAll(".book-button");
                bookingButtons.forEach(button => {
                    button.addEventListener("click", async () => {

                        //se è un utente loggato a premere il bottone prenota
                        if(user) {
                            const listItem = button.closest(".offer-item");
                            listItem.remove();
                            //ottengo l'id dell'offerta da prenotare e chiamo onBookingSubmitted
                            const offerId = button.dataset.offerId;
                            try {
                                this.onBookingSubmitted(offerId);
                                
                                setTimeout(() => {
                                    page("/profile");
                                }, 200); 

                                setTimeout(() => {
                                    const alertMessage = document.getElementById("alert-messages");
                                    alertMessage.innerHTML = createAlert("success-popup", "Offerta prenotata con successo!"); 
                                    setTimeout(() => {
                                        alertMessage.innerHTML = '';
                                    }, 4000);
                                }, 200); 
                            }
                            catch(error) {
                                console.error(error); 
                            };
                        }
                        else {
                            //altrimenti viene portato alla pagina login
                            page("/login");
                        }
                    }); 
                });
            }
        }
        catch(error) {
            console.error(error); 
        }
    }

    //crea la pagina del form di add/edit offerta e chiama onFormSubmitted quando viene premuto il tasto submit del form
    showAddEditForm = async (id) => {
        this.appContainer.innerHTML = createOffersFormPage();
        
        const addForm = document.getElementById("add-form");
    
        //gestione del form: se è di EDIT ha i campi già popolati, altrimenti vutoi
        //se è una modifica
        if(id) {
            //riferimento all'offerta da modificare
            const offer = await OfferManager.getOfferById(id);
            //popola i campi del form di modifica
            document.getElementById("form-nome").value = offer.nome;
            document.getElementById("form-citta").value = offer.citta;
            document.getElementById("form-indirizzo").value = offer.indirizzo;
            document.getElementById("form-tipo").value = offer.tipo;
            document.getElementById("form-descrizione").value = offer.descrizione;
            document.getElementById("form-ospiti").value = offer.ospiti;
            const dataInizio = new Date(offer.datainizio); 
            const dataFine = new Date(offer.datafine); 
            addForm.elements["form-datainizio"].value = dataInizio.toISOString().split("T")[0]; // (questo formato funziona)
            addForm.elements["form-datafine"].value = dataFine.toISOString().split("T")[0];
            document.getElementById("form-costo").value = offer.costo;
  
            addForm.elements["form-id"].value = id; 
        } 
        //se è ADD
        else { 
            //pulisco i campi del form
            addForm.reset();
        }
    
        //imposta la callback per la sottomissione del form
        addForm.addEventListener("submit", this.onFormSubmitted);
    };
     
    //chiamata quando si fa submit di aggiunta o modifica di un'offerta dal form
    onFormSubmitted = (event) => {
        event.preventDefault();
        const addForm = document.getElementById("add-form"); 
            
        const nome = addForm.elements["form-nome"].value.toLowerCase(); //nome e citta sono salvati in minuscolo nel db, in modo da poter rendere poi la ricerca dal form case-insensitive
        const citta = addForm.elements["form-citta"].value.toLowerCase();
        const indirizzo = addForm.elements["form-indirizzo"].value;
        const tipo = addForm.elements["form-tipo"].value;
        const descrizione = addForm.elements["form-descrizione"].value;
        const ospiti = addForm.elements["form-ospiti"].value;
        const datainizio = addForm.elements["form-datainizio"].value;
        const datafine = addForm.elements["form-datafine"].value;
        const costo = addForm.elements["form-costo"].value; 

        const imgInput = addForm.elements["form-img"];
        const imgFile = imgInput.files[0];
    
        //check date (quella di fine non può essere precedente a quella di inizio)
        const checkDataInizio = new Date(datainizio);
        const checkDataFine = new Date(datafine);

        if(checkDataFine <= checkDataInizio) {
            const alertMessage = document.getElementById("alert-messages");
            alertMessage.innerHTML = createAlert("alert-popup", "La data del check-out deve essere successiva alla data del check-in!"); 
            setTimeout(() => {
                alertMessage.innerHTML = '';
            }, 4000);
            return;
        }
    
        //funzione per comprimere l'immagine utilizzando il canvas
        function compressImage(file, maxWidth, maxHeight, quality) {
            return new Promise((resolve, reject) => {
                const image = new Image();
        
                //legge l'immagine come URL
                const reader = new FileReader();
                reader.onload = function (event) {
                    image.src = event.target.result;
                };
                reader.readAsDataURL(file);
        
                //quando l'immagine è caricata
                image.onload = function () {
                    let width = image.width;
                    let height = image.height;
            
                    //ridimensiona l'immagine se necessario
                    if(width > maxWidth || height > maxHeight) {
                        if(width > height) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        } 
                        else {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }
            
                    //crea un canvas con le dimensioni ridotte
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
            
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, width, height);
            
                    //ottieni l'immagine compressa come stringa base64
                    const compressedDataUrl = canvas.toDataURL(file.type, quality);
            
                    resolve(compressedDataUrl);
                };
        
                image.onerror = function (error) {
                    reject(error);
                };
            });
        }
    
        //se è un form di MODIFICA (form-id non è vuoto)
        if(addForm.elements["form-id"].value && addForm.elements["form-id"].value !== "") {
            const id = addForm.elements["form-id"].value;
            
            //comprimi l'immagine
            compressImage(imgFile, 800, 600, 0.8)
            .then((compressedImgBase64) => {

                const dataInizio = moment(datainizio).startOf("day").add(1, "day"); //aggiunge un giorno per correggere il fuso orario
                const dataFine = moment(datafine).startOf("day").add(1, "day");

                const offer = new Offer(id, nome, citta, indirizzo, tipo, ospiti, descrizione, dataInizio, dataFine, costo, compressedImgBase64);
        
                //aggiorna l'offerta
                OfferManager.updateOffer(offer).then(() => {
                    OfferManager.getAllOffers().then(() => {
                        addForm.reset();
                        page("/offers");
                    });
                });
            })
            .catch((error) => {
                console.error("Errore durante la compressione dell'immagine: ", error);
            }); 
        }
        //se è un form di AGGIUNTA
        else {
            //comprimi l'immagine
            compressImage(imgFile, 800, 600, 0.8)
            .then((compressedImgBase64) => {

                const dataInizio = moment(datainizio).startOf("day").add(1, "day"); //aggiunge un giorno per correggere il fuso orario
                const dataFine = moment(datafine).startOf("day").add(1, "day");

                const offer = new Offer(undefined, nome, citta, indirizzo, tipo, ospiti, descrizione, dataInizio, dataFine, costo, compressedImgBase64);
                
                //aggiungi la nuova offerta
                OfferManager.addOffer(offer).then(() => {
                    OfferManager.getAllOffers().then(() => {
                        addForm.reset();
                        page("/offers");
                    });
                });
            })
            .catch((error) => {
                console.error("Errore durante la compressione dell'immagine: ", error);
            });
        }
    }
    

    /*-------------------- Signup ---------------------------*/
    
    //mostra il form di signup
    showSignupForm = async () => {
        this.appContainer.innerHTML = createSignupFormPage();

        const signupForm = document.getElementById("signup-form");
        signupForm.reset(); 
    
        //imposta la callback per la sottomissione del form
        signupForm.addEventListener("submit", this.onSignupFormSubmitted);
    }
    
    //chiamata quando si fa submit al form di signup
    onSignupFormSubmitted = (event) => {
        event.preventDefault();
        const signupForm = event.target;
             
        if(signupForm.checkValidity()) {
            try {
                const nome = signupForm.elements["form-nome"].value;
                const cognome = signupForm.elements["form-cognome"].value;
                const ddn = signupForm.elements["form-ddn"].value;
                const email = signupForm.elements["form-email"].value;
                const password = signupForm.elements["form-password"].value; 
                const imgInput = signupForm.elements["form-img"];
                const imgFile = imgInput.files[0];

                const checkDataNascita = new Date(ddn);
                const minDataNascita = new Date(new Date().getFullYear()-18, new Date().getMonth(), new Date().getDate());
                if(checkDataNascita >= minDataNascita) {
                    //pop-up di errore
                    const alertMessage = document.getElementById("alert-messages");
                    alertMessage.innerHTML = createAlert("alert-popup", "Devi essere maggiorenne per registrarti!"); 
                    setTimeout(() => {
                        alertMessage.innerHTML = "";
                    }, 4000);
                    return;
                }

                //funzione per comprimere l'immagine utilizzando canvas
                function compressImage(file, maxWidth, maxHeight, quality) {
                    return new Promise((resolve, reject) => {
                        const image = new Image();
                
                        const reader = new FileReader();
                        reader.onload = function (event) {
                        image.src = event.target.result;
                        };
                        reader.readAsDataURL(file);
                
                        image.onload = function () {
                            let width = image.width;
                            let height = image.height;
                    
                            if (width > maxWidth || height > maxHeight) {
                                if(width > height) {
                                    height *= maxWidth / width;
                                    width = maxWidth;
                                } 
                                else {
                                    width *= maxHeight / height;
                                    height = maxHeight;
                                }
                            }
                     
                            const canvas = document.createElement("canvas");
                            canvas.width = width;
                            canvas.height = height;
                    
                            const ctx = canvas.getContext("2d");
                            ctx.drawImage(image, 0, 0, width, height);
                    
                            //ottieni l'immagine compressa come stringa base64
                            const compressedDataUrl = canvas.toDataURL(file.type, quality);
                    
                            resolve(compressedDataUrl);
                        };
                
                        image.onerror = function (error) {
                            reject(error);
                        };
                    });
                }

                //comprimi l'immagine
                compressImage(imgFile, 800, 600, 0.8)
                .then((compressedImgBase64) => {
                    const user = new User(undefined, nome, cognome, ddn, email, password, 0, compressedImgBase64); //tipouser sempre 0

                    //aggiungi il nuovo utente
                    UserManager.addUser(user).then( async () => {
                        
                        const user = await UserManager.doLogin(email, password);

                        //salva l'utente loggato localmente, in modo da poter avere un riferimento degli attributi
                        localStorage.clear();
                        localStorage.setItem("user", JSON.stringify(user));

                        signupForm.reset();
                        page("/profile"); 
                    });
                })
                .catch((error) => {
                    console.error("Errore durante la compressione dell'immagine: ", error);
                });  
            } 
            catch(error) { 
                if(error) { 
                    //mostra un messaggio di errore login (es. password errata)
                    const alertMessage = document.getElementById("alert-messages");
                    alertMessage.innerHTML = createAlert("alert-popup", error); 
                    setTimeout(() => {
                        alertMessage.innerHTML = "";
                    }, 4000);
                }
            }
        }
    } 

    /*-------------------- Login ---------------------------*/

    //mostra il form di login
    showLoginForm = async () => {
        this.appContainer.innerHTML = createLoginFormPage();

        const loginForm = document.getElementById("login-form");
        loginForm.reset(); 
    
        //imposta la callback per la sottomissione del form
        loginForm.addEventListener("submit", this.onLoginFormSubmitted);
    }

    //chiamata quando si fa submit al form di login
    onLoginFormSubmitted = async (event) => {
        event.preventDefault();
        const loginForm = event.target; 

        if(loginForm.checkValidity()) {
            try {
                const email = loginForm.elements["form-email"].value;
                const password = loginForm.elements["form-password"].value;

                //fa login con email e psw 
                const user = await UserManager.doLogin(email, password);

                //salva l'utente loggato localmente, in modo da poter avere un riferimento degli attributi
                localStorage.clear();
                localStorage.setItem("user", JSON.stringify(user));
                page.redirect("/profile");
            }
            catch(error) { 
                if(error) { 
                    //mostra un messaggio di errore login (es. password errata)
                    const alertMessage = document.getElementById("alert-messages");
                    alertMessage.innerHTML = createAlert("alert-popup", ""+error); 
                    setTimeout(() => {
                        alertMessage.innerHTML = "";
                    }, 4000);
                }
            }
        }
    }


    /*-------------------- Logout ---------------------------*/

    //fa logout
    logout = async () => { 
        await UserManager.doLogout();

        //svuota il localStorage che contiene l'utente
        localStorage.clear();
        page.redirect("/");
    }


    /*-------------------- Profilo ---------------------------*/

    //mostra il profilo utente
    showProfilePage = async (user) => {
        try { 
            this.appContainer.innerHTML = createProfilePage(user);
           
            //ottiene la lista delle prenotazioni di questo specifico utente
            const bookings = await BookingManager.getBookingsFromUserId(user.id);

            const bookinglist = document.querySelector("#booking-list");
            bookinglist.innerHTML = ""; //svuota la lista prima di popolarla

            //per ogni prenotazione, crea un bookingListItem e lo inserisce nella booking-list
            for(const booking of bookings) { 
                const bookingListItem = createBookingListItem(booking);
                bookinglist.insertAdjacentHTML("beforeend", bookingListItem);
            }

            if(bookings.length === 0) {
                const msg = "<br></br><h4>Non hai nessuna prenotazione. Vai nella sezione Offerte per iniziare!</h4>";
                bookinglist.insertAdjacentHTML("beforeend", msg);
            }

            //seleziona tutti i pulsanti di cancellazione prenotazione e li rende listener del click
            const cancelButtons = document.querySelectorAll(".book-cancel-button"); 
            cancelButtons.forEach(button => {

                button.addEventListener("click", async () => {
 
                    const listItem = button.closest(".booking-item");
                    listItem.remove();
                    //ottengo l'id della prenotazione da eliminare e chiamo onBookingCanceled
                    const bookingId = button.dataset.bookingId;
                    try {
                        this.onBookingCanceled(bookingId);
                        
                        setTimeout(() => {
                            page("/profile");
                        }, 200); 

                        setTimeout(() => {
                            const alertMessage = document.getElementById("alert-messages");
                            alertMessage.innerHTML = createAlert("success-popup", "Prenotazione cancellata con successo!"); 
                            setTimeout(() => {
                                alertMessage.innerHTML = "";
                            }, 4000);
                        }, 200); 
                    }
                    catch(error) {
                        console.error(error); 
                    }; 
                }); 
            });
        }
        catch(error) {
            console.error(error); 
        }
    }
 

    /*-------------------- Recensioni ---------------------------*/

    //mostra le recensioni
    showReviews = async () => {
        try {  
            const reviews = await ReviewManager.getAllReviews();
           
            const reviewlist = document.querySelector("#review-list");
            reviewlist.innerHTML = ""; //svuota la lista prima di popolarla

            //per ogni review, crea un'reviewListItem e lo inserisce nella review-list
            for(const review of reviews){ 
                const reviewListItem = createReviewListItem(review);
                reviewlist.insertAdjacentHTML("beforeend", reviewListItem);
            }
        }
        catch(error) {
            console.error(error); 
        }
    }

    //crea la pagina di form per aggiunta recensione
    showReviewForm = async () => {
        this.appContainer.innerHTML = createReviewsFormPage();
        
        const reviewForm = document.getElementById("review-form"); 
        reviewForm.reset();

        //imposta la callback per la sottomissione del form
        reviewForm.addEventListener("submit", this.onReviewFormSubmitted);
    }

    //chiamato quando si fa submit di creazione recensione
    onReviewFormSubmitted = (event) => {
        event.preventDefault();
        const reviewForm = document.getElementById("review-form"); 
             
        const titolo = reviewForm.elements["form-titolo"].value;
        const stelle = reviewForm.elements["form-stelle"].value;
        const testo = reviewForm.elements["form-testo"].value;
     
        const user = JSON.parse(localStorage.getItem("user"));
        const autore = ""+user.nome+" "+user.cognome+"";
        const img = user.img;
        
        const review = new Review(undefined, autore, img, stelle, titolo, testo);

        ReviewManager.addReview(review).then(() => {
            ReviewManager.getAllReviews().then(() => {
                reviewForm.reset();
                page("/reviews");
            });
        });  
    }


    /*-------------------- Prenotazioni ---------------------------*/

    //metodo che viene chiamato quando viene cliccato il pulsante "Prenota" su un'offerta
    onBookingSubmitted = async (offerId) => {
        try {
            //ottengo l'offerta dall'id
            const offer = await OfferManager.getOfferById(offerId);
            
            const user = JSON.parse(localStorage.getItem("user"));
            
            const dataInizio = moment.utc(offer.datainizio).local();
            const dataFine = moment.utc(offer.datafine).local();

            //istanzio un'oggetto prenotazione con gli stessi campi dell'offerta
            const booking = new Booking(undefined, offer.nome, offer.citta, offer.indirizzo, offer.tipo, offer.ospiti, offer.descrizione, dataInizio, dataFine, offer.costo, offer.img, user.id);
            
            //aggiungo la prenotazione alla lista prenotazioni dell'utente
            await BookingManager.addBooking(booking);
            //rimuovo l'offerta dalla lista offerte 
            await OfferManager.deleteOffer(offerId) 
        } 
        catch(error) {
            console.error(error);
        }
    }; 

    //metodo che viene chiamato quando viene cliccato il pulsante "Cancella prenotazione" su una prenotazione
    onBookingCanceled = async (bookingId) => {
        try {
            //ottengo la prenotazione dall'id
            const booking = await BookingManager.getBookingById(bookingId);
            
            const dataInizio = moment.utc(booking.datainizio).local();
            const dataFine = moment.utc(booking.datafine).local();

            //istanzio un'oggetto offerta con gli stessi campi della prenotazione
            const offer = new Offer(undefined, booking.nome, booking.citta, booking.indirizzo, booking.tipo, booking.ospiti, booking.descrizione, dataInizio, dataFine, booking.costo, booking.img);
            
            //aggiungo l'offerta alla lista delle offerte
            await OfferManager.addOffer(offer);
            //rimuovo la prenotazione dalla lista prenotazioni dell'utente 
            await BookingManager.deleteBooking(bookingId) 
        } 
        catch(error) {
            console.error(error);
        }
    }
}

export default App;
