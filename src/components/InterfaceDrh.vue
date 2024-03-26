<template>
  <div class="dashboard-drh">
    <header class="dashboard-header fixed-header">
      <div class="logo-wrapper">
        <img src="/snel.png" alt="Logo IFolder">
        <span class="company-name">IFolder</span>
      </div>
      
      <div class="logout-button-wrapper">
        <button class="logout-button" @click="handleLogout">Se déconnecter</button>
      </div>
    </header>
      <!-- Barre latérale -->
      <div class="dashboard-content">
        <nav class="dashboard-sidebar">
        <div class="sidebar-wrapper">
            <!-- Titre Dashboard cliquable -->
            <button class="dashboard-title" @click="goToDashboard">Dashboard</button>
            <ul class="sidebar-menu">
            <li class="sidebar-item" v-for="item in menuItems" :key="item.title">
                <router-link :to="`/agents/drh/${this.$route.params.id}/${item.title}`" class="sidebar-link" @click="handleClick(item.title)">
                {{ formatTitle(item.title) }}
                <span class="category-agents">({{ totalAgentsByCategory[item.title] }} agents)</span>
                <svg class="sidebar-arrow" viewBox="0 0 10 10">
                    <path d="M1 1l4 4 4-4"></path>
                </svg>
                </router-link>
            </li>
            </ul>
        </div>
        </nav>

      </div>
  
      <!-- Contenu principal -->
      <div class="main-content">
          <div class="section">
              <div class="card">
                <canvas id="lineChart"></canvas>
              </div>
              
          </div>
          <br>
          <br>
          <div>
              <div>
                  <input type="text">
                  <button>Recherche</button>
              </div>
              <table class="table">
                  <thead>
                      <tr>
                          <th>Matricule de l'agent</th>
                          <th>Nom du fichier</th>
                          <th>Type du fichier</th>
                          <th>Date de téléchargement</th>
                          <th>Matricule du gestionnaire</th>
                      </tr>
                  </thead>
                  <tbody class="">
              <tr v-for="file in recentFiles" :key="file.documentID">
                <td>{{ file.agentID }}</td>
                <td>{{ file.designation }}</td>
                <td>{{ file.type_name }}</td>
                <td>{{ file.creation_date }}</td>
                <td>{{ file.managerID }}</td>
              </tr>
            </tbody>
              </table>
          </div>
      </div>
  </div>
  </template>
  
  
  <script>

import Chart from 'chart.js/auto';

export default {
  name: 'InterfaceDrh',
  data() {
    return {
      menuItems: [],
      totalAgents: 0,
      totalDocuments: 0,
      recentFiles: [],
      agent: null,
      agentCategories: [],
      totalAgentsByCategory: {},
      currentCategory: null,
      lineChart: null, 
    };
  },
  methods: {
    

    async fetchRecentFiles() {
      try {
        const response = await fetch('http://localhost:3000/documents');
        if (response.ok) {
          const files = await response.json();
          const sortedFiles = files.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
          const recentFiles = sortedFiles.slice(0, 10).map(file => ({
            designation: file.designation,
            type_name: file.path.split('.').pop(),
            path: file.path,
            creation_date: file.creation_date,
            managerID: file.managerID,
            agentID : file.agentID,
          }));
          this.recentFiles = recentFiles;
        } else {
          console.error('Erreur lors de la récupération des fichiers récents :', response.statusText);
        }
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des fichiers récents :', error);
      }
    },
    goToDashboard() {
      this.$router.push({ name: 'DashBoard' });
    },
        // Générer des couleurs aléatoires pour les segments du graphique
    generateRandomColors(count) {
      const colors = [];
      for (let i = 0; i < count; i++) {
        colors.push(this.getRandomColor());
      }
      return colors;
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },

    formatTitle(title) {
      // Formater la chaîne de caractères pour avoir la première lettre en majuscule
      const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
      return formattedTitle;
    },
    toggleScale(target) {
      const element = document.querySelector(`.${target}`);
      if (element) {
        element.classList.toggle('scale');
      }
    },
    handleLogout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push({ name: 'HelloWorld' });
    },
    handleClick(category) {
      this.currentCategory = category; // Enregistre la catégorie actuellement cliquée
    },
    async fetchAgentData(id) {
      const apiUrl = `http://localhost:3000/agents/${id}`;
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const agentData = await response.json();
          this.agent = agentData;
        
        } else {
          console.error('Erreur lors de la récupération des données de l\'agent :', response.statusText);
        }
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données de l\'agent :', error);
      }
    },
    async fetchManagerData(id) {
      const apiUrl = `http://localhost:3000/gerer/manager/${id}`;
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const managerData = await response.json();
          console.log("Données du manager :", managerData);
          
          // Récupérer les name_category
          const nameCategories = managerData.map(manager => manager.Category.name_category);
          console.log("cest :", nameCategories)
          this.agentCategories = nameCategories;

          
          // Créer les menuItems en utilisant les name_category
          this.menuItems = nameCategories.map(category => ({
            title: category,
            to: `/agents/${id}/${category}`
          })); 
          // Initialiser la variable temporaire
          let totalAgents = 0;
          for (const category of nameCategories) {
            const apiUrl = `http://localhost:3000/agents?category=${category}`;
            try {
              const response = await fetch(apiUrl);
              if (response.ok) {
                const agents = await response.json();

                // Filtrer les agents en fonction de la catégorie
                const filteredAgents = agents.filter(agent => agent.Grade.Category.name_category === category);

                this.totalAgentsByCategory[category] = filteredAgents.length;

                // Ajouter le total de la catégorie à la variable temporaire
                totalAgents += filteredAgents.length;
              } else {
                console.error(`Erreur lors de la récupération du nombre d'agents pour la catégorie ${category}:`, response.statusText);
              }
            } catch (error) {
              console.error(`Une erreur s'est produite lors de la récupération du nombre d'agents pour la catégorie ${category}:`, error);
            }
          }
          this.totalAgents = totalAgents;
              
        } else {
          console.error("Erreur lors de la récupération des données du manager :", response.statusText);
        }
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la récupération des données du manager :",
          error
        );
      } 
    }, 
    
    // Méthode pour créer le graphique linéaire
    createLineChart() {
        console.log("affiche", this.menuItems);
        const chartData = {
            labels: this.nameCategories, // Utilisation des catégories comme étiquettes
            datasets: [
            {
                label: 'Nombre d\'agents par catégorie',
                data: Object.values(this.totalAgentsByCategory), // Utilisation des nombres des catégories
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }
            ]
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false
        };

        this.lineChart = new Chart(document.getElementById('lineChart'), {
            type: 'line',
            data: chartData,
            options: chartOptions
        });
        }
  },
  created() {
    const id = this.$route.params.id;
    this.fetchAgentData(id);
    this.fetchRecentFiles();
    this.fetchManagerData(id);
  },
  mounted() {
    // Créer le graphique linéaire lors du montage du composant
    this.createLineChart();
  }
};
</script>
  
  
  
<style scoped>
/* Styles pour la dashboard-sidebar */
.dashboard-drh {
    position: relative; /* Permet d'utiliser position: fixed sur les enfants */
  font-family: 'Dosis', sans-serif;
  /*font-family: 'Poppins', sans-serif; */
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.dashboard-sidebar {
  position: fixed;
  flex: 0 0 250px;
  top: 60px;
  left: 0;
  bottom: 0;
  z-index: 1;
  display: block;
  background-color: #333;
  color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 30px;
  transition: all 0.3s cubic-bezier(0.685, 0.0473, 0.346, 1);
  width: 260px;
  box-shadow: 4px 0 20px -5px rgba(0, 0, 0, 0.6);
}
.dashboard-sidebar::-webkit-scrollbar {
  width: 6px;
}
.dashboard-sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

.dashboard-sidebar .nav .nav-item {
  margin-bottom: 4px;
}

.dashboard-sidebar .nav .nav-item .nav-link {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 15px;
  color: #fff;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.685, 0.0473, 0.346, 1);
}

.dashboard-sidebar .nav .nav-item .nav-link .badge {
  position: absolute;
  right: 10px;
  padding: 2px 5px;
  border-radius: 50%;
  font-size: 0.75rem;
}

.dashboard-sidebar .nav .nav-item .nav-link.active {
  background-color: rgba(255, 255, 255, 0.1);
}

.dashboard-sidebar .nav .nav-item .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.dashboard-sidebar .logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  font-size: 20px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
}

.dashboard-sidebar .logo img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.dashboard-sidebar .nav-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 0 15px;
  color: rgba(255, 255, 255, 0.5);
}

.dashboard-sidebar .nav-title span {
  display: block;
  
}

.dashboard-sidebar .divider {
  margin: 0 15px;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
}

.dashboard-sidebar .user-info {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 15px;
  border-radius: 0 25px 25px 0;
  background-color: rgba(0, 0, 0, 0.2);
  
}

.dashboard-sidebar .user-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.dashboard-sidebar .user-info .username {
  margin-top: 10px;
  font-size: 1rem;
}

.dashboard-sidebar .sidebar-background {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
}

.dashboard-sidebar.sidebar-mini .sidebar-wrapper {
  padding-left: 0;
}

.dashboard-sidebar.sidebar-mini .logo {
  padding: 10px;
}

.dashboard-sidebar.sidebar-mini .nav-item .nav-link {
  padding-left: 15px !important;
  padding-right: 15px !important;
}

.dashboard-sidebar.sidebar-mini .nav-title {
  display: none;
}

.dashboard-sidebar.sidebar-mini .divider {
  display: none;
}

.dashboard-sidebar.sidebar-mini .user-info {
  padding: 20px;
}

.dashboard-sidebar.sidebar-mini .user-info img {
  width: 30px;
  height: 30px;
}

.dashboard-sidebar.sidebar-mini .user-info .username {
  display: none;
}

.dashboard-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 20px;
  color: white;
  background-color: transparent;
  border: none;
  cursor: pointer; /* Ajoutez un style de curseur pointer */
  padding: 10px; /* Ajoutez un padding pour améliorer l'interaction */
  display: inline-block; /* Assurez-vous que le lien agit comme un bouton */
}

.dashboard-title:hover {
  background-color: rgba(255, 255, 255, 0.1); /* Ajoutez un fond de couleur au survol */
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  margin-bottom: 10px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  transition: background-color 0.3s;
}

.sidebar-link:hover {
  background-color: #417688;
}

.sidebar-arrow {
  width: 10px;
  height: 10px;
  margin-left: auto;
  fill: currentColor;
}
.table-responsive{
  flex : 70%
}
.category-agents {
  font-size: 14px;
  color: white;
  
}
.category-name {
  
  font-weight: bold;
}
.category-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
.category-title::marker {
  display: none;
}
.category-wrapper {
  margin-bottom: 20px;
}

.category-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.category-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.dashboard-sidebar .category-list li {
  display: flex;
  justify-content: space-between;
}
.category-item {
  margin-bottom: 10px;
}

.category-link {
  display: block;
  padding: 10px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s;
}

.category-link:hover {
  background-color: #eaeaea;
}
.category-agents {
  font-size: 14px;
  color: #da4848;
}

/* Styles pour la main-content */
.main-content {
  margin-left: 300px; /* Laisse de l'espace pour la sidebar */
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.recent-files-container {
  flex: 1; /* Remplissez tout l'espace disponible */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
 }

.stats-section {
  display: flex;
  flex-wrap: wrap; /* Permet aux éléments de se répartir sur plusieurs lignes */
  gap: 20px;
  margin-top: 20px;
}
.combined-stats {
  display: flex;
  flex: 1;
}
.table-bordered {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 10px;
}

.table-bordered thead th {
  font-weight: bold;
  color: #000;
  border-bottom: 2px solid #dee2e6;
  background-color: #f5f5f5;
}

.table-bordered tbody td,
.table-bordered thead th {
  padding: 12px 15px;
  border: 1px solid #dee2e6;
}

.table-bordered tbody td {
  font-size: 14px;
  color: #333;
}

.table-bordered tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table-bordered tbody tr:hover {
  background-color: #ddd;
}

.dashboard-header {
   /* Laisse de l'espace pour la sidebar */
   background-color: #333;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  /*
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-area: header;
  z-index: 1000;  Assure que le header reste au-dessus du contenu */

 
}
.dashboard-header.fixed-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.dashboard-content {
  display: flex;
  flex-grow: 1;
}
.logo-wrapper {
  display: flex;
  align-items: center;
}

.logo-wrapper img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.company-name {
  font-size: 24px;
  font-weight: bold;
  
}
.logout-button-wrapper {
  align-self: center;
}

.agent-name {
  font-weight: bold;
  font-size: 24px;
  
}

.user-info img {
  width: 32px;
  height: 32px;
}

.menu-items {
  display: flex;
  gap: 10px;
  text-decoration: none;
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

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.total-agent,
.total-document {
  flex: 30%;
  padding: 20px;
  
  color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(to right, #40d7eb, #35518f);
  
}
.recent-files-container {
  flex: 70%;
  padding: 20px;
  
  color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(to right, #35518f, #40d7eb);
}

.total-agent:hover,
.recent-files-container:hover {
  transform: scale(1.05);
}

.total-label {
  font-weight: bold;
  font-size: 16px;
}

.total-agent:hover,
.total-document:hover {
  transform: scale(1.05);
}


.total-label {
  font-weight: bold;
  font-size: 16px; /* Réduire la taille de la police */
}

.total-value {
  font-size: 20px; /* Réduire la taille de la police */
  margin-top: 6px; /* Ajuster la marge supérieure */
}


.recent-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
  
}

.recent-list {
  list-style: none;
  padding: 0;
  
}

.recent-list li {
  margin-bottom: 10px;
}

</style>