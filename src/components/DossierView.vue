<template>
    <div>
      <h1>Dossier</h1>
      
      <div class="filters">
        <input type="text" v-model="search" placeholder="Rechercher par nom" />
        <select v-model="selectedDepartment">
          <option value="">Tous les départements</option>
          <option v-for="department in departments" :key="department" :value="department">{{ department }}</option>
        </select>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Département</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <td>{{ employee.name }} </td>
            <td>{{ employee.department }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import data from '@/../public/data.json';
  
  export default {
    name: 'DossierView',
    data() {
      return {
        employees: [],
        search: '',
        selectedDepartment: '',
      };
    },
    computed: {
      filteredEmployees() {
        let filtered = this.employees;
        
        // Filtrer par nom
        if (this.search) {
          filtered = filtered.filter(employee => employee.name.toLowerCase().includes(this.search.toLowerCase()));
        }
        
        // Filtrer par département
        if (this.selectedDepartment) {
          filtered = filtered.filter(employee => employee.department === this.selectedDepartment);
        }
        
        return filtered;
      },
      departments() {
        return [...new Set(this.employees.map(employee => employee.department))];
      }
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
  }
    
  };
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