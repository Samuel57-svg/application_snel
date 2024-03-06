<template>
  <div class="dossier-view-container">
    <header class="dashboard-header">
      <div class="logo-wrapper">
        <img src="/snel.png" alt="Logo IFolder">
        <span class="company-name">IFolder</span>
      </div>

      <div class="logout-button-wrapper">
        <button class="logout-button" @click="handleLogout">Se déconnecter</button>
      </div>
    </header>
    <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-primary" @click="goBack">Retour</button>
      </div>
    <!-- Contenu du tableau de bord 
    <nav class="dashboard-sidebar">
      <div class="category-title">Échelons</div>
      <ul class="category-list">
        <li v-for="item in menuItems" :key="item.title">
          <router-link :to="`/agents/${this.$route.params.id}/${item.title}`" @click="handleClick(item.title)">{{ formatTitle(item.title)  }}</router-link>
          <span class="category-agents">({{ totalAgentsByCategory[item.title] }} agents)</span>    
        </li>
      </ul>
    </nav> -->

    <!-- <main class="main-content">   -->


    <h1 class="dossier-title">Échelon : {{ formatTitle(selectedCategory) }}</h1>

    <div class="filters-container">
      <input type="text" v-model="search" placeholder="Rechercher par nom ou matricule" class="form-control">
      <select v-model="selectedFonction" class="form-select">
        <option value="">Toutes les fonctions</option>
        <option v-for="fonction in fonctions" :key="fonction" :value="fonction">{{ fonction }}</option>
      </select>
    </div>

    <div class="table-container">
      <table class="table table-bordered"> 
        <thead>
          <tr>
            <th scope="col">Agent ID</th>
            <th scope="col">Grade</th>
            <th scope="col">Nom</th>
            <th scope="col">Post-nom</th>
            <th scope="col">Fonction</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in filteredEmployees" :key="employee.agentID" @click="goToDocumentView(employee)" :class="{ 'row-clicked': clickedRows[employee.agentID] }">
            <td >{{ employee.agentID }}</td>
            <td>{{ employee.Grade ? employee.Grade.grade_name : "Unknown"}}</td>
            <td>{{ employee.nom }}</td>
            <td>{{ employee.last_name }}</td>
            <td>{{ employee.fonction }}</td>
            <td>
              <button type="button" class="btn btn-primary btn-sm" @click.stop="goToDocumentView(employee)">
                <i class="fas fa-plus"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    <!-- 
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-primary" @click="showMoreRows">{{ showAllRows ? 'Voir moins' : 'Voir plus' }}</button>

      </div> -->
    </div>
  <!-- </main> -->
  </div>
</template>

<script>
export default {
  name: 'DossierView',
  data() {
    return {
      employees: [],
      search: '',
      selectedFonction: '',
      id: '',
      clickedRows: {},
      //visibleRows: 10,
      //showAllRows: false,
    };
  },
  computed: {
    selectedCategory() {
      return this.$route.params.name_category;
    },
    filteredEmployees() {
      let filtered = this.employees.slice(0, this.visibleRows);
      
      // Filtrer par nom ou par Agent ID
      if (this.search) {
        filtered = filtered.filter(employee => {
          const searchValue = this.search.toLowerCase();
          return (
            employee.nom.toLowerCase().includes(searchValue) ||
            employee.agentID.toLowerCase().includes(searchValue)
          );
        });
      }
      
      // Filtrer par département ou fonction
      if (this.selectedFonction) {
        filtered = filtered.filter(employee => employee.fonction === this.selectedFonction);
      }
      
      return filtered;
    },
    fonctions() {
      return [...new Set(this.employees.map(employee => employee.fonction))];
    },
  },
  beforeRouteUpdate(to, fromn, next) {
    // Récupérer le paramètre name_category de la nouvelle route
    const nameCategory = to.params.name_category;

    // Charger les données en fonction de la nouvelle route
    this.loadData(nameCategory);

    next();
  },
  methods: {
    /*
    showMoreRows() {
      // Basculez la valeur entre true et false à chaque clic
      this.showAllRows = !this.showAllRows;
      if (this.showAllRows) {
        this.visibleRows = this.employees.length;
      } else {
        this.visibleRows = 10;
      }
    }, */
    getGradeName(gradeID) {
      const employee = this.employees.find(employee => employee.gradeID === gradeID);
      return employee && employee.Grade ? employee.Grade.grade_name : 'Unknown';
    },
    formatTitle(title) {
      // Formater la chaîne de caractères pour avoir la première lettre en majuscule
      const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
      return formattedTitle;
    },
    goToDocumentView( employee) {
      this.clickedRows[employee.agentID] = true;

      this.$router.push({ 
        name: 'DocumentView', 
        params: { 
          id: this.$route.params.id,
          name_category: this.$route.params.name_category,
          name: employee.nom 
        } 
      });
    },
    goBack() {
    this.$router.push({ name: 'DashBoard' });
    },
    handleLogout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push({ name: 'HelloWorld' });
    },
    async fetchAgentCategoty(name_category) {
      const url = 'http://10.1.44.176:3000/agents'; // URL pour récupérer tous les agents
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          this.employees = data.filter(employee => employee.Grade.Category.name_category === name_category);
          console.log(this.employees); // Vérifiez si les agents sont correctement filtrés
        } else {
          console.error('Erreur lors de la récupération des données:', response.statusText);
        }
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
      }
    },
  },
  mounted() {
    
    const name_category = this.$route.params.name_category;
    this.fetchAgentCategoty(name_category);

  }
/*
  async mounted() {
  const nameCategory = this.$route.params.name_category;
  console.log(nameCategory); // Affiche le paramètre name_category dans la console

  const url = 'http://10.1.44.176:3000/agents'; // URL pour récupérer tous les agents
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      this.employees = data.filter(employee => employee.Grade.Category.name_category === nameCategory);
      console.log(this.employees); // Vérifiez si les agents sont correctement filtrés
    } else {
      console.error('Erreur lors de la récupération des données:', response.statusText);
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données:', error);
  }
}, */
};
</script>

  
<style scoped>
.dossier-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative; /* Permet d'utiliser position: fixed sur les enfants */
}
.dashboard-sidebar {
  margin-top: 60px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 300px;
  background-color: #375561;
  color: white;
  padding: 10px;
  overflow-y: auto;
}
.dashboard-header {
  background-color: #333;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.main-content {
  margin-left: 300px; /* Laisse de l'espace pour la sidebar */
  padding: 20px;
}
.logo-wrapper {
  display: flex;
  align-items: center;
}
.d-flex  {
  display: flex;
  align-items: center;
  margin-right: auto;
}
.logo-wrapper img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.row-clicked {
  background-color: #3c77af; /* Couleur de fond de la ligne cliquée */
  transition: background-color 0.3s; /* Transition pour rendre l'effet plus fluide */
}
.company-name {
  font-size: 24px;
  font-weight: bold;
}
.logout-button-wrapper {
  align-self: center;
}

.logout-button {
  padding: 8px 16px;
  font-size: 16px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #cc0000;
}
.dossier-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.filters-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.form-control {
  padding: 8px;
  margin: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 440px;
}

.table-container {
  width: 80%;
  margin: 0 auto;
}

.table {
  width: 100%;
  /*border-collapse: separate; */
  border-spacing: 0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 20px;
  border-collapse: collapse;
}

th {
  background-color: #f3f3f3;

}

td, th { 
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0; 
} 

tr:nth-child(even) {
  background-color: #f9f9f9;
}
tr:hover {
  background-color: #f5f5f5;
}
/* Supprimez la bordure en bas de la dernière ligne pour éviter le double trait */
tr:last-child td, tr:last-child th {
  border-bottom: none;
}

td {
  color: #333;
}

th, td { /*
  text-align: center; */
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}


.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0069d9;
}
</style>