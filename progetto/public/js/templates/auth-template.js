"use strict"; 
 
//crea la pagina form di login
function createLoginFormPage() {
    return `<!--Form per login--> 
    <section class="form-slides"> 
        <!--Per rendere le immagini schiarite--> 
        <div class="form-background-overlay form-row">  
            <form id="login-form" role="form" method="POST" action="" class="col-5">  
                <div id="alert-messages"></div>
                <div class="modal-body">
                    <div class="form-group mt-5">  
                        <label for="form-email" class="control-label"><b>Indirizzo mail:</b></label>
                        <input id="form-email" type="email" class="form-control input-lg" name="Email" placeholder="Inserisci l'email..." required>
                    </div>

                    <div class="form-group mt-5">
                        <label for="form-password" class="control-label"><b>Password:</b></label>
                        <input id="form-password" type="password" class="form-control input-lg" name="Password" placeholder="Inserisci la password..." required>
                    </div>
                </div>

                <div class="modal-footer mt-5">
                    <div class="form-group">
                        <button type="submit" class="btn">Accedi</button>
                    </div>
                </div> 
         
            </form>
        </div> 
    </section>`;
}

//crea la pagina form di signup
function createSignupFormPage() {
    return `<!--Form per signup-->
    <section class="form-slides">
        <!--Per rendere le immagini schiarite--> 
        <div class="form-background-overlay "> 
            <form id="signup-form" role="form" method="POST" action="">
                <div class="modal-body">
                    
                    <div id="alert-messages"></div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group mt-5">
                                <label class="control-label"><b>Nome:</b></label>
                                <input id="form-nome" type="text" class="form-control input-lg" name="Nome" placeholder="Inserisci il tuo nome..." required>
                            </div>

                            <div class="form-group mt-5">
                                <label class="control-label"><b>Cognome:</b></label>
                                <input id="form-cognome" type="text" class="form-control input-lg" name="Cognome" placeholder="Inserisci il tuo cognome..." required>
                            </div>

                            <div class="form-group mt-5">
                                <label class="control-label"><b>Data di nascita:</b></label>
                                <input id="form-ddn" type="date" class="form-control input-lg" name="DataNascita" required>
                            </div>  
                        </div>

                        <div class="col-md-6"> 
                            <div class="form-group mt-5">  
                                <label for="form-email" class="control-label"><b>Indirizzo mail:</b></label>
                                <input id="form-email" type="email" class="form-control input-lg" name="Email" placeholder="Inserisci l'email..." required>
                            </div>

                            <div class="form-group mt-5">
                                <label for="form-password" class="control-label"><b>Password:</b></label>
                                <input id="form-password" type="password" class="form-control input-lg" name="Password" placeholder="Inserisci la password..." minlength="5" required>
                            </div>

                            <div class="form-group mt-5">
                                <label for="form-img"><b>Immagine profilo:</b></label>
                                <br>
                                <input type="file" class="form-control-file" id="form-img" accept=".jpg, .jpeg, .png" required>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer pb-5">
                    <div class="form-group">
                        <button type="submit" class="btn">Registrati</button>
                    </div>
                </div>
            </form>
        </div> 
    </section>`;
}

//crea la user-area con Accedi e Registrati (in caso di mancata autenticazione)
function createLoginSignupLinks() {
    return `<!--modifica la zona di accesso, mettendo i bottoni per LOgin e Signup-->
    <div class="navbar-nav ml-md-auto">
        <a class="nav-link" href="/login" id="login">Accedi</a>
    </div> 
    <div class="navbar-nav ml-md-auto">
        <a class="nav-link" href="/signup" id="signup">Registrati</a>
    </div>`;
}

//crea la user-area con Profilo e Esci (in caso di corretta autenticazione)
function createProfileExitLinks(user) {
    return `<!--modifica la zona di accesso, mettendo il Profilo e il bottone Esci-->
    <div class="navbar-nav ml-md-auto">
        <div class="welcome-container">
            <div class="welcome-img">
                <a href="/profile" id="profile">
                    <img src="${user.img}" alt="${user.nome}" class="profile-image">
                </a>
            </div>
            <!-- <a class="nav-link" href="/profile" id="profile">Profilo</a> -->
        </div>
    </div>
    <div class="navbar-nav ml-md-auto">
        <a class="nav-link" href="/logout" id="exit">Esci</a>
    </div>`;
}

export {createLoginFormPage, createSignupFormPage, createLoginSignupLinks, createProfileExitLinks};