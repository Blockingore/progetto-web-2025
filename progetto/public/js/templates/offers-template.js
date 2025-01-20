"use strict"; 
 
//crea il page-content della pagina offerte (filtri, titolo, offer-list)
function createOffersPage() {
  return `<!--Form di filtraggio -->  
    <form class="filter-form bg-warning" id="filter-form">

        <div class="container-fluid row justify-content-center">  
            <div class="col-md-8 justify-content-center">
                <div class="row"> 

                    <!--Selezione location-->
                    <div class="col-md-4 form-group">
                        <label class="control-label">Dove vuoi andare?</label>
                        <div>
                            <input id="form-location" type="text" class="form-control input-lg" name="location" placeholder="Inserisci una città / nome struttura..." >
                        </div>
                    </div>

                    <!--Selezione tipo struttura-->
                    <div class="col-md-4 form-group">
                        <label for="Tipo di struttura" class="mr-1">Tipo di struttura:</label>
                        <select id="Tipo di struttura" name="tipo" class="form-control" > 
                            <option value="">Scegli un tipo di struttura:</option>
                            <option value="Hotel">Hotel</option>
                            <option value="BedAndBreakfast">Bed & Breakfast</option>
                            <option value="CasaVacanza">Casa vacanza</option> 
                        </select>
                    </div>

                    <!--Selezione numero ospiti-->
                    <div class="col-md-4 form-group">
                        <label for="Ospiti" class="mr-1">Numero di ospiti:</label>
                        <select id="Ospiti" name="ospiti" class="form-control" >
                            <option value="">Seleziona il numero di ospiti:</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>

                    <!--Selezione date-->
                    <div class="col-md-6 form-group">
                        <label class="control-label">Dal:</label>
                        <div>
                            <input id="startID" type="date" class="form-control input-lg" name="start" >
                        </div>
                    </div> 
                    <div class="col-md-6 form-group">
                        <label class="control-label">Al:</label>
                        <div>
                            <input id="endID" type="date" class="form-control input-lg" name="end" >
                        </div>
                    </div>
                </div> 
            </div> 
        </div> 
        <div class="text-center mt-3" id="submit-filter-button">
            <button type="submit" class="btn">Cerca</button>
        </div>
    </form>

    <!--Titolo della pagina-->
    <h1 id="page-title">Risultati:</h1>

    <div id="alert-messages"></div>
    
    <!--Lista degli alloggi-->
    <div id="offer-list-id">
        <ul class="list-group offer-list" id="offer-list"> 
            <!--Riempita con JS-->
        </ul>
    </div>  

    <!--Bottone aggiungi offerta-->
    <a id="add-offer-button" href="/offers/add" type="button" class="btn btn-lg invisible">
        <b>Aggiungi un'offerta</b>
    </a>`;
}

//crea un singolo item della lista offerte 
function createOfferListItem(offer) { 
    const datainizio = moment(offer.datainizio).format("DD/MM/YYYY");
    const datafine = moment(offer.datafine).format("DD/MM/YYYY");

    //mette le maiuscole ai nomi e città, per la vista nel dom (nel db sono tutte minuscole)
    function capitalizeFirstLetter(string) {
        if (typeof string !== "string") { 
            //se per caso nome o città non sono di tipo stringa, li ritorno così come sono
            return string;
        }
        return string.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
            return char.toUpperCase();
        });
    }
    
    const nomeCapitalized = capitalizeFirstLetter(offer.nome);
    const cittaCapitalized = capitalizeFirstLetter(offer.citta);
 

    return `<!--Singolo item della lista offerte-->
    <li class="offer-item">
        <img src="${offer.img}" alt="${nomeCapitalized}">
        <div class="offer-fields justify-content-between">
            <div class="d-flex">
                <h4 class="offer-name"><b>${nomeCapitalized}</b></h4>  
                <span class="badge offer-type">${offer.tipo}</span>
                <h4>Ospiti: ${offer.ospiti}</h4>
            </div>
            <p class="offer-address"><u>${offer.indirizzo}, ${cittaCapitalized}</u></p>

            <h6 class="offer-description">${offer.descrizione}</h6>

            <p><b>Check-in: ${datainizio} - Check-out: ${datafine}</b></p> 
            <span class="badge cost-badge bg-warning text-dark">Prezzo: € ${offer.costo.toFixed(2)}</span>
        </div>
        
        <div class="button-container">

            <a class="btn edit-button invisible" href="/offers/${offer.id}/edit" id="edit-button"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="24.5" height="24.5" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
            </a>

            <button class="btn delete-button invisible" data-offer-id="${offer.id}" id="delete-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24.5" height="24.5" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                </svg>
            </button>

            <button class="btn book-button" data-offer-id="${offer.id}" id="book-button">Prenota</button>
        </div>
    </li>`;
}

export {createOffersPage, createOfferListItem};