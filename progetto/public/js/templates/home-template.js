"use strict";

//crea il page-content della homepage 
function createHomePage() {
    return `<!--Banner con slide a tempo-->
    <section class="slides">
        <!--Per rendere le immagini schiarite-->
        <div class="slides-overlay"></div>
        <div class="slides-content">
            <h1 class="text">Viaggi Senza Pensieri</h1>
            <p class="text">Occasioni da tutto il mondo</p>
            <a id="bottone-vaialleofferte" href="/offers" class="btn bg-warning text-dark">Vai alle nostre offerte</a>
        </div> 
    </section>

    <!--Descrizione del sito-->
    <section class="siteDescription">
        <h2 class="descriptionTitle">Benvenuto su Viaggi Senza Pensieri</h2>
        <p>
            Viaggi Senza Pensieri è una realtà che ti mostra le migliori offerte sul mercato, con ottime recensioni ed un servizio impeccabile. 
            Non temere di essere in ritardo con la prenotazione! Siamo qui per aiutarti a trovare la sistemazione perfetta per il tuo prossimo viaggio, 
            sia che tu stia cercando una location modesta oppure un'opzione di lusso. 
            Abbiamo una vasta selezione di occasioni speciali proposte da strutture di tutto il mondo, verificate dai nostri esperti travelers, che ti permetteranno 
            di risparmiare fino al 50% sul normale prezzo degli alloggi.
            Il nostro obiettivo è quello di rendere il processo di ricerca e prenotazione il più facile possibile: puoi ricercare la tua soluzione in base alla location, 
            al tipo di struttura, al numero di ospiti e ad altri filtri personalizzati.
        </p> 
        <p> 
            Il nostro team di esperti è sempre disponibile per aiutarti a scegliere la sistemazione perfetta per te, 
            e il nostro servizio clienti è disponibile 24 ore su 24 per rispondere a qualsiasi tua domanda.
        </p>
        <p>
            Siamo entusiasti di offrirti le migliori soluzioni per la tua sistemazione, in modo semplice ed affidabile. 
            Grazie per averci scelto e buon viaggio!
        </p>
    </section>

    
    <!--Sezione delle features--> 
    <section class="features justify-content-between">
        <div class="feature">
            <img src="./imgs/features/f1.jpg" alt="Prenotazione facile">
            <h3>Prenotazione facile</h3>
            <p>
                Su VSP, prenotare il tuo alloggio per le vacanze non potrebbe essere più facile. Basta inserire il luogo, le date e il tipo di sistemazione che desideri, 
                e otterrai una vasta scelta di opzioni tra cui scegliere. Puoi anche impostare dei filtri personalizzati per affinare la ricerca e trovare la sistemazione 
                perfetta in pochi click.
            </p>
        </div>
        <div class="feature">
            <img src="./imgs/features/f2.jpg" alt="Visita le migliori location">
            <h3>Visita le migliori location</h3>
            <p>
                Che tu stia cercando una vacanza rilassante sulla spiaggia o un'avventura in montagna, nel nostro elenco offerte speciali troverai una vasta selezione di alloggi
                immersi in paesaggi da urlo. Potrai scegliere tra le migliori destinazioni in tutto il mondo e goderti panorami mozzafiato dalla tua camera o durante 
                le tue attività all'aria aperta.
            </p>
        </div>
        <div class="feature">
            <img src="./imgs/features/f3.jpg" alt="Servizi igienici impeccabili">
            <h3>Servizi igienici impeccabili</h3>
            <p>
                Quando si sceglie un alloggio per le proprie vacanze, la pulizia e l'igiene sono molto importanti. Su VSP, troverai solo offerte di alloggio con 
                servizi igienici impeccabili e pulizia costante, per garantire il massimo comfort e la sicurezza durante il tuo soggiorno.
            </p>
        </div>
    </section>
    

    
    <!--Recensioni sito-->
    <section class="homereviews">
        <div class="homereview">
            <img src="./imgs/reviewers/r1.jpg" alt="Reviewer 1">
            <div class="homereview-text">
                <h3>Eurostars Hotels</h3>
                <p>"Viaggi Senza Pensieri: una delle migliori esperienze di booking last minute in circolazione"</p>
            </div>
        </div>
        <div class="homereview">
            <img src="./imgs/reviewers/r2.jpg" alt="Reviewer 2">
            <div class="homereview-text">
                <h3>Safe Travels</h3>
                <p>"Possiamo affermare con certezza che Viaggi Senza Pensieri offre occasioni davvero imperdibili"</p>
            </div>
        </div>
        <div class="homereview">
            <img src="./imgs/reviewers/r3.jpg" alt="Reviewer 3">
            <div class="homereview-text">
                <h3>Vacation Club</h3>
                <p>"Cogliete la palla al balzo e prenotate subito un'offerta da Viaggi Senza Pensieri. Non ve ne pentirete!"</p>
            </div>
        </div>
    </section>`;
}

export default createHomePage;