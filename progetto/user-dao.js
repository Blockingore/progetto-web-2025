"use strict";

const sqlite = require("sqlite3"); 
const db = new sqlite.Database("project.db", (err) => {
    if (err) throw err;
});
const bcrypt = require("bcrypt"); 


exports.createUser = function (user) {
    return new Promise((resolve, reject) => {
    const sql = "INSERT INTO utenti (nome, cognome, ddn, email, password, tipouser, img) VALUES (?, ?, ?, ?, ?, ?, ?)";
    bcrypt.hash(user.password, 10).then((hash) => {
        db.run(
            sql, [user.nome, user.cognome, user.ddn, user.email, hash, user.tipouser, user.img], function(err) {
                if(err) {
                    reject(err);
                }
                else {
                    resolve({userId: this.lastID});
                }
            }
        );
    });
    });
};

exports.getUserById = function(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM utenti WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } 
            else if (row === undefined) {
                resolve({ error: "User not found." });
            } 
            else {
                const user = {
                    id: row.id,
                    nome: row.nome,
                    cognome: row.cognome,
                    ddn: row.ddn,
                    email: row.email,
                    password: row.password,
                    tipouser: row.tipouser,
                    img: row.img
                };
                resolve(user);
            }
        });
    });
};
  
exports.getUser = function(email, password) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM utenti WHERE email = ?";
        db.get(sql, [email], (err, row) => {
            if(err) 
                reject(err);
            else if(row === undefined)
                resolve({error: "User not found."});
            else {
                const user = {id: row.id, email: row.email, tipouser: row.tipouser};
                let check = false;
                
                if(bcrypt.compareSync(password, row.password))
                check = true;

                resolve({user, check});
            }
        });
    });
}
