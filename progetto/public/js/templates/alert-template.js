"use strict";

//crea la notifica di alert (in caso di errori o comunicazioni di avvenuta operazione)
function createAlert(type, message) {
    return `<!-- pop-up di alert-->
    <div class="alert alert-dismissible ${type}" id="alert-popup">
        <span><b>${message}</b></span>  
    </div>`;
}
  
export default createAlert;