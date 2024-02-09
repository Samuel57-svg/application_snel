<template>
  <div class="card">
    <nav class="navbar fixed-top" style="background-color: #C3BDE5; text-align: center;">
      <div class="container-fluid">
        <a class="navbar-brand" href="#" style="margin: 0 auto;">E-PERSONNEL SNEL</a>
      </div>
    </nav>
    <img src="snel.PNG" class="card-img-bottom" alt="...">
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Connexion</h5>
            </div>
            <div class="card-body">
              <div v-if="showError" class="card-footer text-danger">agentID ou mot de passe incorrect</div>
              <form id="connexion-form" @submit.prevent="handleConnexion">
                <div class="mb-3">
                  <label for="agentID" class="form-label">Numéro agentID</label>
                  <input type="text" id="agentID" name="agentID" class="form-control" placeholder="Entrez votre numéro agentID" v-model="agentID">
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Mot de passe</label>
                  <input type="password" id="password" name="password" class="form-control" placeholder="Entrez votre mot de passe" v-model="password">
                  <input type="checkbox" id="afficher-mdp" class="form-check-input" v-model="showPassword">
                  <label for="afficher-mdp" class="form-check-label">Afficher le mot de passe</label>
                </div>
                
                <button type="submit" class="btn btn-primary">Se connecter</button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '@/../public/data1.json';
//import axios from 'axios';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      agentID: '',
      password: '',
      showPassword: false,
      showError: false
    };
  },
  methods: { /*
    async handleConnexion() {
      const url = 'http://192.168.137.213:3000/gestionnaire';
      try {
        const response = await fetch(url);
        const users = response.data;
        const { agentID, password } = this;
  
        const user = users.find(user => user.agentID === agentID && user.password === password);
        */
        handleConnexion() {
      // Utilisez les valeurs des variables liées
      var matricule = this.matricule;
      var password = this.password;
      
      // Comparez les informations avec les données du fichier JSON
      var user = data.find(item => item.matricule === matricule && item.password === password);



        if (user) {
          localStorage.setItem('isAuthenticated', true);
          this.$router.push('/dossier');
          this.$emit('authenticated');
        } else {
          this.showError = true;
        }
        /*
      } catch (error) {
        console.log(error);
      } */
    },
    togglePassword() {
    this.showPassword = !this.showPassword;
  },
    }
  }
  </script>

<style>

.eye-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

.eye-icon span {
  cursor: pointer;
}

.error-message {
  color: red;
  margin-top: -10px;
  margin-bottom: 10px;
  text-align: center;
}
</style>