"use strict"; 
 
//crea il page-content della pagina profilo
function createProfilePage(user) {
    const ddn = moment(user.ddn).format("DD/MM/YYYY");   
    return `<div class="row m-0"> 
        <!--Info profilo a sx-->
        <aside class="col col-3 row user-info">
            <div>
                <img src="${user.img}" alt="${user.email}"></img>
                <br></br>
                <div class="user-data">
                    <br></br>
                    <h3><u>Dati utente</u></h3>
                    <h4><b>Nome:</b> ${user.nome} </h4> 
                    <h4><b>Cognome:</b> ${user.cognome} </h4> 
                    <h4><b>Email:</b> ${user.email}</h4> 
                    <h4><b>Data di nascita:</b> ${ddn}</h4>
                    <h6><b>Tipo permessi utente:</b> ${user.tipouser}</h6>
                    <br></br>
                </div>

                <!--Bottone per il form di sottomissione recensione-->
                <a class="btn bg-warning text-dark mb-5 mt-5" href="/reviews/add" id="write-review-btn">Dicci cosa ne pensi di VSP</a>
            </div> 
        </aside>

        <!--Lista prenotazioni a dx-->
        <div class="col col-9 user-bookings">
            <h1>Le mie prenotazioni</h1>

            <div id="alert-messages"></div>

            <ul class="list-group booking-list" id="booking-list">   
            </ul>
        </div> 
    </div>`;
}

//crea un singolo item della lista prenotazioni 
function createBookingListItem(booking) {
    const datainizio = moment(booking.datainizio).format("DD/MM/YYYY");
    const datafine = moment(booking.datafine).format("DD/MM/YYYY");

    //mette le maiuscole ai nomi e città, per la vista nel browser (nel db sono tutte minuscole)
    function capitalizeFirstLetter(string) {
        if (typeof string !== "string") { 
            //se per caso nome o città non sono di tipo stringa, li ritorno così come sono
            return string;
        }
        return string.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
            return char.toUpperCase();
        });
    }
    
    const nomeCapitalized = capitalizeFirstLetter(booking.nome);
    const cittaCapitalized = capitalizeFirstLetter(booking.citta);

    return `<li class="booking-item">
        <img src="${booking.img}" alt="${booking.nome}">
        <div class="booking-fields"> 
            <h4 class="booking-name"><b>${nomeCapitalized}</b></h4>
            <p class="booking-address"><u>${booking.indirizzo}, ${cittaCapitalized}</u></p>

            <p>Ospiti: ${booking.ospiti}</p>
            <p class="booking-date"><b>Check-in: ${datainizio} - Check-out: ${datafine}</b></p>  
            <span class="badge cost-badge bg-warning text-dark">Prezzo: € ${booking.costo.toFixed(2)}</span>
        </div>
        <button class="btn book-cancel-button" data-booking-id="${booking.id}" id="book-cancel-button">Cancella prenotazione</button>
    </li>`;
}

export {createProfilePage, createBookingListItem};