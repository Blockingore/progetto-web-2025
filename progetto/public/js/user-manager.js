"use strict";

import User from "./user.js"; 

//Classe che gestisce gli utenti
class UserManager {
    
    //aggiunge un utente (dopo la registrazione)
    static addUser = async (user) => {

        let response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user), //trasforma l'oggetto user in json
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

    //fa il login -> i.e: CREA UNA SESSIONE
    static doLogin = async (username, password) => {
        //fa una POST con un json body contenente email e password (crea una sessione)
        let response = await fetch("/api/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password}),
            
        }); 
        if(response.ok) {
            const responseData = await response.json(); 
    
            const user = User.from(responseData);
            //restituisce un oggetto User contenente i dati dell'utente
            return user;
        }
        else {
            try { 
                const errDetail = await response.json();
                throw errDetail.message;
            }
            catch(err) { 
                throw err;
            }
        }
    }
    
    //fa il logout -> i.e: DISTRUGGE LA SESSIONE CURRENT (id nel cookie)
    static doLogout = async () => {
        await fetch("/api/sessions/current", { method: "DELETE" });
    }
}             

export default UserManager;