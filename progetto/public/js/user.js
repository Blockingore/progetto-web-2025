"use strict";

class User {
 
    constructor(id=undefined, nome, cognome, ddn, email, password=undefined, tipouser, img) {
        this.id = id;
        this.nome = nome;
        this.cognome = cognome;
        this.ddn = ddn;
        this.email = email;
        this.password = password;
        this.tipouser = tipouser;
        this.img = img; 
    }

    //METODI
    static from(json) { //prende un json e ritorna un oggetto di tipo User
        const user = Object.assign(new User(), json);
        return user;
    }
}

export default User;