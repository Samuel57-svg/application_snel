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
              <form id="connexion-form" @submit.prevent="handleConnexion">
                <div class="mb-3">
                  <label for="matricule" class="form-label">Numéro matricule</label>
                  <input type="text" id="matricule" name="matricule" class="form-control" placeholder="Entrez votre numéro matricule" v-model="matricule">
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
            <div v-if="showError" class="card-footer text-danger">Matricule ou mot de passe incorrect</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '@/../public/data.json';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      matricule: '',
      password: '',
      showPassword: false,
      showError: false
    };
  },
  methods: {
    handleConnexion() {
      if (!this.matricule || !this.password) {
      // Afficher un message d'erreur si les champs sont vides
      this.showError = true;
      return;
      }
    
      // Utilisez les valeurs des variables liées
      var matricule = this.matricule;
      var password = this.password;
      
      // Comparez les informations avec les données du fichier JSON
      var user = data.find(item => item.matricule === matricule && item.password === password);
      
      if (user) {
        // Redirigez vers la page DossierView.vue
        this.$router.push('/DossierView');
      } else {
        // Affichez un message d'erreur
        this.showError = true;
      }
    }
    }
  }
</script>