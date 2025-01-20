"use strict";

//crea il page-content della pagina di form aggiunta recensione
function createReviewsFormPage() {
    return `<!-- Form per aggiungere una recensione -->
    <section class="form-slides">
        <!--Per rendere le immagini schiarite--> 
        <div class="form-background-overlay form-row"> 
            <form id="review-form" role="form" method="POST" action="" class="col-5">
                <div class="modal-body">
                    <div class="form-group mt-5">
                        <label class="control-label"><b>Titolo:</b></label>
                        <input id="form-titolo" type="text" class="form-control input-lg" name="Titolo" placeholder="Inserisci un titolo..." required>
                    </div>

                    <div class="form-group mt-5">
                        <label class="control-label"><b>Valutazione:</b></label>
                        <select id="form-stelle" class="form-control input-lg" name="Stelle"> 
                            <option>⭐⭐⭐⭐⭐</option> 
                            <option>⭐⭐⭐⭐</option>
                            <option>⭐⭐⭐</option>
                            <option>⭐⭐</option> 
                            <option>⭐</option>  
                        </select>
                    </div>

                    <div class="form-group mt-5">
                        <label for="form-testo"><b>Testo (max 350 caratteri):</b></label>
                        <textarea id="form-testo" class="form-control" minlength="100" maxlength="350"></textarea>
                    </div>
                </div>

                <div class="modal-footer mt-5">
                    <div class="form-group">
                        <button type="submit" class="btn">Pubblica la recensione</button>
                    </div>
                </div>
            </form>
        </div>
    </section>`;
}

export default createReviewsFormPage;