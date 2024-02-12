<template>
    <div class="d-flex justify align-items">
      <h1>Dossier</h1>
      
      <div class="filters">
        <input type="text" v-model="search" placeholder="Rechercher par nom" class="form-control"/>
        <input type="text" v-model="searchAgentID" placeholder="Rechercher par Agent ID" class="form-control">
        <select v-model="selectedFonction" class="form-select">
          <option value="">Toutes les fonctions</option>
          <option v-for="fonction in fonctions" :key="fonction" :value="fonction">{{ fonction }}</option>
        </select>

      </div>
      
      <table class="table table-bordered"> 
        <thead>
          <tr>
            <th scope="col">Agent ID</th>
            <th scope="col">Nom</th>
            <th scope="col">Post-nom</th>
            <th scope="col">Fonction</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in filteredEmployees" :key="employee.agentID">
            <td>{{ employee.agentID }}</td>
            <td @click="goToDocumentView(employee)">{{ employee.nom }}</td>
            <td>{{ employee.post_nom }}</td>
            <td>{{ employee.fonction }}</td>
            <td>
            <button type="button" class="btn btn-primary btn-sm" @click="goToDocumentView(employee)">
              <i class="fas fa-plus"></i>
            </button>
          </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
import data from '@/../public/data.json';
import 'bootstrap/dist/css/bootstrap.css';


//import axios from 'axios';

export default {
  name: 'DossierView',
  data() {
    return {
      employees: [],
      search: '',
      selectedFonction: '',
      searchAgentID: '',
    };
  },
  computed: {
    filteredEmployees() {
      let filtered = this.employees;
      
      // Filtrer par nom
      if (this.search) {
        filtered = filtered.filter(employee => employee.nom.toLowerCase().includes(this.search.toLowerCase()));
      }
      
      // Filtrer par département
      if (this.selectedFonction) {
        filtered = filtered.filter(employee => employee.fonction === this.selectedFonction);
      }
      
      
      // Filtrer par agentID
      if (this.searchAgentID) {
        filtered = filtered.filter(employee => employee.agentID.toLowerCase().includes(this.searchAgentID.toLowerCase()));
      }
      
      return filtered;
    },

    sortedFilteredEmployees() {
      const sorted = [...this.filteredEmployees].sort((a, b) => (a.agentID > b.agentID ? 1 : -1));

      return sorted;
    },
    // Obtenir la liste des fonctions uniques des employés
    
    fonctions() {
      return [...new Set(this.employees.map(employee => employee.fonction))];
    }
  },
  methods: {
    goToDocumentView(employee) {
      this.$router.push({ name: 'DocumentView', params: { name: employee.nom } });
    },
    // ...
  },
  created() {
    // Vérifier si l'utilisateur est authentifié
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion
      this.$router.push('/');
    
  
    } else {
    // Récupérer les données nécessaires ou effectuer toute autre logique
    this.employees = data;
    }
      /*
      const url = 'http://192.168.137.213:3000/agent';
      try {
        const response = await fetch(url);
        this.employees = response.data;
      } catch (error) {
        console.log(error);
      } */
    }
  }
;
</script>
  
<style scoped>
  .filters {
    margin-bottom: 1rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 0.5rem;
    border: 1px solid #ccc;
  }
</style>