"use strict"; 
 
//crea il page-content della pagina recensioni 
function createReviewsPage() {
    return `<!--Contenuto pagina recensioni-->
        <h1 id="reviews-title">Recensioni VSP</h1>
        <ul class="review-grid review-list mt-5 mb-5" id="review-list"> 

        </ul>`;
}

//crea un singolo item della lista di recensioni 
function createReviewListItem(review) {
    return `<!--Singolo elemento recensione-->
    <li class="review-item">
        <img src="${review.img}">
        <div class="review-description">  
            <h5><b>${review.titolo}</b></h5> 
            <h6><b>${review.autore}</b></h6> 
            <span class="badge review-stars">${review.stelle}</span>
            <p>${review.testo}</p>  
        </div> 
    </li>`;
}


export {createReviewsPage, createReviewListItem};