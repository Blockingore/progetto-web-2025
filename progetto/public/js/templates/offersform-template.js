"use strict";

//crea il page-content della pagina di form aggiunta/modifica offerta
function createOffersFormPage() {
    return `<!-- Form per aggiungere un'offerta -->  
    <div id="alert-messages"></div>

    <form id="add-form" role="form" method="POST" action="">
        <div class="modal-body">
            <input type="text" id="form-id" name="id" hidden>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group mt-3">
                        <label class="control-label"><b>Nome:</b></label>
                        <input id="form-nome" type="text" class="form-control input-lg" name="Nome" placeholder="Inserisci il nome..." required>
                    </div>

                    <div class="form-group mt-3">
                        <label class="control-label"><b>Città:</b></label>
                        <input id="form-citta" type="text" class="form-control input-lg" name="Citta" placeholder="Inserisci la città..." required>
                    </div>

                    <div class="form-group mt-3">
                        <label class="control-label"><b>Indirizzo:</b></label>
                        <input id="form-indirizzo" type="text" class="form-control input-lg" name="Indirizzo" placeholder="Inserisci l'indirizzo..." required>
                    </div>
                    
                    <div class="form-group mt-3">
                        <label class="control-label"><b>Tipo:</b></label>
                        <select id="form-tipo" class="form-control input-lg" name="Tipo">
                            <optgroup label="Scegli un tipo di sistemazione:">
                                <option>Hotel</option>
                                <option>BedAndBreakfast</option>
                                <option>CasaVacanza</option>
                            </optgroup>
                        </select>
                    </div>

                    <div class="form-group mt-3">
                        <label for="form-descrizione"><b>Breve descrizione (max 600 caratteri):</b></label>
                        <textarea id="form-descrizione" class="form-control" minlength="100" maxlength="650"></textarea>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group mt-3">
                        <label class="control-label"><b>Ospiti:</b></label>
                        <select id="form-ospiti" class="form-control input-lg" name="Ospiti">
                            <optgroup label="Seleziona il numero di ospiti:">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </optgroup>
                        </select>
                    </div>
    
                    <div class="form-group mt-3">
                        <label class="control-label"><b>Data inizio:</b></label>
                        <input id="form-datainizio" type="date" class="form-control input-lg" name="DataInizio" required>
                    </div>

                    <div class="form-group mt-3">
                        <label class="control-label"><b>Data fine:</b></label>
                        <input id="form-datafine" type="date" class="form-control input-lg" name="DataFine" required>
                    </div>

                    <div class="form-group mt-3">
                        <label class="control-label"><b>Costo:</b></label>
                        <input id="form-costo" type="text" class="form-control input-lg" name="Costo" placeholder="Inserisci un prezzo..." required>
                    </div>

                    <div class="form-group mt-3">
                        <label for="form-img"><b>Immagine:</b></label>
                        <br>
                        <input type="file" class="form-control-file" id="form-img" accept=".jpg, .jpeg, .png" required>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-footer pb-5">
            <div class="form-group">
                <button type="submit" class="btn">Conferma</button>
            </div>
        </div>
    </form>`;
}

export default createOffersFormPage;