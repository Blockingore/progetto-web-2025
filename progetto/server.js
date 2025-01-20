"use strict";

const express = require("express");
const morgan = require("morgan");
const {check, validationResult} = require("express-validator");
const dao = require("./dao.js"); 
const userDao = require("./user-dao.js");
const path = require("path");
const passport = require("passport"); 
const LocalStrategy = require("passport-local").Strategy; 
const session = require("express-session");  

//localStrategy
passport.use(new LocalStrategy(
    function(username, password, done) {
        userDao.getUser(username, password).then(({user, check}) => {
            //controllo email 
            if (!user) {
                return done(null, false, { message: "Email non corretta!"});
            }
            //controllo password
            if (!check) {
                return done(null, false, { message: "Password non corretta!"});
            }

            //imposta il ruolo dell'utente in base al campo tipouser
            if(user.tipouser === 0) { 
                user.role = "customer"; 
            } 
            else if (user.tipouser === 1) { 
                user.role = "admin"; 
            }     

            //se tutto OK, ritorno l'user
            return done(null, user);
        })
    }
));

//serializzazione: associa id utente a id sessione
passport.serializeUser(function(user, done) {
    done(null, {id: user.id, role: user.role}); 
});
//deserializzazione
passport.deserializeUser(function(serializedUser, done) {
    userDao.getUserById(serializedUser.id).then(user => {
        user.role = serializedUser.role; 
        done(null, user);
    });
}); 

//init express
const app = express();
const port = 3000;

app.use(morgan("tiny"));
app.use(express.json()); //i body di tutte le richieste che arrivano al server sono considerati json

//setup dei componenti "public"
app.use(express.static("public"));

//Queste 2 funzioni sono controlli che proteggono gli api endpoints 
//verifica se l'utente è autenticato come admin
const isLoggedAsAdmin = (req, res, next) => { 
    if(req.isAuthenticated() && req.user.role === "admin") {
        return next();
    }
    return res.status(401).json({statusCode: 401, message: "Non hai i permessi da admin"});
}; 
//verifica se l'utente è autenticato come cliente registrato o admin (verifica che non sia un utente anononimo)
const isLoggedAsCustomerOrAdmin = (req, res, next) => { 
    if(req.isAuthenticated() && (req.user.role === "customer" || req.user.role === "admin")) {
        return next();
    }
    return res.status(401).json({statusCode: 401, message: "Non hai i permessi da utente registrato" });
};


app.use(session({
    secret: "a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie",
    resave: false,
    saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());



/*===========================================================*/
/*===================== ENDPOINTS OFFERTE ===================*/
/*===========================================================*/

//GET /offers
//Recupera tutte le offerte, con un filtro se nella query dell'url
app.get("/api/offers", (req, res) => { 
    dao.getOffers(req.query) //es: http://localhost:3000/offers?location=Milano&tipo=Hotel&ospiti=2&start=2023-09-12&end=2023-09-13
    .then((offers) => res.json(offers)) //se promise resolve
    .catch(() => res.status(500).end());  //se promise reject
});
  
//POST /offers
//Creare una nuova offerta
app.post("/api/offers", isLoggedAsCustomerOrAdmin, [ 
    //validazione dei campi con express-validator 
    check("nome").notEmpty(),
    check("citta").notEmpty(),
    check("indirizzo").notEmpty(),
    check("tipo").notEmpty(),
    check("ospiti").notEmpty(),
    check("descrizione").notEmpty(),
    check("datainizio").notEmpty(),
    check("datafine").notEmpty(), 
    check("costo").notEmpty(), 
    ], (req, res) => {
        const errors = validationResult(req); //è questo metodo che inizia i controlli di validazione e salva errori eventuali nella variabile errors
        if(!errors.isEmpty()) { //se ho qualche errore lo ritorno
            return res.status(422).json({errors: errors.array()});
        }
        
        const offer = { 
            nome: req.body.nome,
            citta: req.body.citta,
            indirizzo: req.body.indirizzo,
            tipo: req.body.tipo,
            ospiti: req.body.ospiti,
            descrizione: req.body.descrizione,
            datainizio: req.body.datainizio,
            datafine: req.body.datafine,
            costo: req.body.costo,
            img: req.body.img,
        };
        dao.createOffer(offer) 
        .then((result) => res.status(201).header("Location", `/offers/${result}`).end())
        .catch((err) => res.status(503).json({ error: "Database error during the creation"}));
});

//GET /offers/:id
//Recupera una offer dato l'id
app.get("/api/offers/:id", (req, res) => {
    dao.getOfferById(req.params.id) 
    .then((offers) => res.json(offers))
    .catch((error) => res.status(404).json(error));
});

//PUT /offers/:id
//Aggiorna una offer dato l'id
app.put("/api/offers/:id", isLoggedAsAdmin, [ 
    //validazione dei campi con express-validator 
    check("nome").notEmpty(),
    check("citta").notEmpty(),
    check("indirizzo").notEmpty(),
    check("tipo").notEmpty(),
    check("ospiti").notEmpty(),
    check("descrizione").notEmpty(),
    check("datainizio").notEmpty(),
    check("datafine").notEmpty(),
    check("costo").notEmpty(),
    check("img").notEmpty(), 
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) { //se ho qualche errore lo ritorno
            return res.status(422).json({errors: errors.array()});
        }
    
        const offer = req.body;
        dao.updateOfferById(req.params.id, offer) //id e new info prese da req.body
        .then((result) => {
            if(result)
                res.status(404).json(result);
            else
                res.status(200).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{"param": "Server", "msg": err}],
        })); 
});
 
//DELETE /offers/:id
//Cancella una offer dato l'id
app.delete("/api/offers/:id", isLoggedAsCustomerOrAdmin, (req,res) => {
    dao.deleteOffer(req.params.id)
    .then((result) =>  { //se Promise resolve
        if(result)
            res.status(404).json(result);
        else
            res.status(204).end();
    })
    .catch((err) => res.status(500).json({ //se promise reject
        errors: [{"param": "Server", "msg": err}],
    }));
});
 

/*===========================================================*/
/*=================== ENDPOINTS RECENSIONI ==================*/
/*===========================================================*/

//GET /reviews
//Recupera tutte le recensioni
app.get("/api/reviews", (req, res) => { 
    dao.getReviews() 
    .then((reviews) => res.json(reviews)) //se promise resolve
    .catch(() => res.status(500).end());  //se promise reject
});
  
//POST /reviews
//Creare una nuova recensione
app.post("/api/reviews", isLoggedAsCustomerOrAdmin, [ 
    //validazione dei campi con express-validator  
    check("img").notEmpty(),
    check("stelle").notEmpty(),
    check("titolo").notEmpty(),
    check("testo").notEmpty(),
    ], (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) { 
            return res.status(422).json({errors: errors.array()});
        }
  
        const review = { //nuova review con le info prese dalla req.body
            autore: req.body.autore,
            img: req.body.img,
            stelle: req.body.stelle,
            titolo: req.body.titolo,
            testo: req.body.testo,
        };
        dao.createReview(review) //passo lq review appena creata
        .then((result) => res.status(201).header("Location", `/reviews/${result}`).end())
        .catch((err) => res.status(503).json({ error: "Database error during the creation"}));
});


/*===========================================================*/
/*================= ENDPOINTS PRENOTAZIONI ==================*/
/*===========================================================*/
  
//POST /bookings
//Creare una nuova prenotazione
app.post("/api/bookings", isLoggedAsCustomerOrAdmin, [ 
    //validazione dei campi con express-validator 
    check("nome").notEmpty(),
    check("citta").notEmpty(),
    check("indirizzo").notEmpty(),
    check("tipo").notEmpty(),
    check("ospiti").notEmpty(),
    check("descrizione").notEmpty(),
    check("datainizio").notEmpty(),
    check("datafine").notEmpty(),
    check("costo").notEmpty(),
    check("img").notEmpty(), 
    check("user_id").notEmpty(),
    ], (req, res) => {
        const errors = validationResult(req); 
        if(!errors.isEmpty()) { 
            return res.status(422).json({errors: errors.array()});
        }
  
        const booking = {
            nome: req.body.nome,
            citta: req.body.citta,
            indirizzo: req.body.indirizzo,
            tipo: req.body.tipo,
            ospiti: req.body.ospiti,
            descrizione: req.body.descrizione,
            datainizio: req.body.datainizio,
            datafine: req.body.datafine,
            costo: req.body.costo,
            img: req.body.img,
            user_id: req.body.user_id,
        };
        dao.createBooking(booking) 
        .then((result) => res.status(201).header("Location", `/bookings/${result}`).end())
        .catch((err) => res.status(503).json({ error: "Database error during the creation"}));
});

//GET /bookings
//Recupera tutte le prenotazioni dato l'id utente
app.get("/api/bookings", isLoggedAsCustomerOrAdmin, (req, res) => {  
    dao.getBookingsByUserId(req.query.user_id) 
    .then((bookings) => res.json(bookings))
    .catch((error) => res.status(404).json(error));
});

//GET /bookings/:id
//Recupera una prenotazione dato l'id
app.get("/api/bookings/:id", (req, res) => {
    dao.getBookingById(req.params.id)  
    .then((bookings) => res.json(bookings))
    .catch((error) => res.status(404).json(error));
});

//DELETE /bookings/:id
//Cancella una prenotazione dato l'id
app.delete("/api/bookings/:id", isLoggedAsCustomerOrAdmin, (req,res) => {
    dao.deleteBooking(req.params.id, req.user.id)
    .then((result) =>  { //se Promise resolve
        if(result)
            res.status(404).json(result);
        else
            res.status(204).end();
    })
    .catch((err) => res.status(500).json({ //se promise reject
        errors: [{"param": "Server", "msg": err}],
    }));
});


/*===========================================================*/
/*================= ENDPOINTS AUTENTICAZIONE ================*/
/*===========================================================*/


//POST /users
//Crea un nuovo utente (signup)
app.post("/api/users", [
    //validazione dei campi con express-validator
    check("nome").notEmpty(),
    check("cognome").notEmpty(),
    check("ddn").notEmpty(),
    check("email").notEmpty(),
    check("password").notEmpty(),
    check("tipouser").notEmpty(),
    check("img").notEmpty(),
    ],  (req, res) => { 
    
    const user = { //creo un'utente con le info prese dalla req.body
        nome: req.body.nome,
        cognome: req.body.cognome,
        ddn: req.body.ddn,
        email: req.body.email,
        password: req.body.password, 
        tipouser: 0,
        img: req.body.img,
    };
    userDao.createUser(user)
    .then((result) => res.status(201).header("Location", `/users/${result}`).end())
    .catch((err) => res.status(503).json({ error: "Database error during the signup"}));
});

//POST /sessions 
//Login
app.post("/api/sessions", function(req, res, next) { 
    passport.authenticate("local", function(err, user, info) { //funzione done
        if (err) //se user non è valido
        { 
            return next(err) 
        }  
        if (!user) {
            return res.status(401).json(info);  
        }
        //success, fa il login
        req.login(user, function(err) {
            if (err) { return next(err); }
            //ritorna al frontend (doLogin) i dati dell'utente loggato
            userDao.getUserById(user.id).then(fullUser => {
                return res.json(fullUser);
            });
        });
    })(req, res, next);
});  


//DELETE /sessions/current 
//Logout
app.delete("/api/sessions/current", function(req, res){
    req.logout(function(err) {
        if (err) { 
            return res.status(500).json({ error: "Errore durante il logout" });
        }
        res.end();
    });
});



//per qualunque altra GET diversa, risponde mandando il file index.html 
app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "public/index.html"));
});

//attiva il server
app.listen(port, () => console.log(`VSP listening at http://localhost:${port}`));

