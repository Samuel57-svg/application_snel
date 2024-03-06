<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="logo-wrapper">
        <img src="/snel.png" alt="Logo IFolder">
        <span class="company-name">IFolder</span>
      </div>
      <div class="logout-button-wrapper">
        <button class="logout-button" @click="handleLogout">Se déconnecter</button>
      </div>
    </header>

    <nav class="dashboard-sidebar">
      <div class="sidebar-wrapper">
        <ul class="sidebar-menu">
          <li class="sidebar-item" v-for="item in menuItems" :key="item.title">
            <router-link :to="`/agents/${this.$route.params.id}/${item.title}`" class="sidebar-link" @click="handleClick(item.title)">
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


    <main class="main-content">

      
      <div class="top-bar">
        <div class="user-info">
          <div v-if="agent">
            <i class="fas fa-user" aria-hidden="true"></i>
            <div class="agent-name">{{ agent.nom }} {{ agent.last_name }}</div>
            <div>{{ agent.fonction }}</div>
          </div>
        </div>
        <nav>      
          <ul class="menu-items">

          </ul>
        </nav>

      </div>
      <div class="stats-section">
        <div class="total-agent" @mouseover="toggleScale('total-agent')" @mouseleave="toggleScale('total-agent')">
          <div class="total-label">Total Agents</div>
          <div class="total-value">{{ totalAgents }}</div>
        </div>
        <div class="total-document" @mouseover="toggleScale('total-document')" @mouseleave="toggleScale('total-document')">
          <div class="total-label">Total Documents</div>
          <div class="total-value">{{ totalDocuments }}</div>
        </div>
      </div>
      <div class="recent-files">
        <h3 class="recent-title">Ajouts récents de fichiers</h3>
        <ul class="recent-list">
          <li v-for="file in recentFiles" :key="file.id">
            <router-link :to="file.path">{{ file.name }}</router-link>
          </li>
          <li v-if="!recentFiles.length">Aucun fichier récent</li>
        </ul>
      </div>
      <!-- Contenu du tableau de bord -->
      <router-view></router-view>
      <div class="chart-container">
        <canvas id="chart"></canvas>
      </div>
    </main>
  </div>
</template>


<script>

import Chart from 'chart.js/auto';

export default {
  name: 'DashBoard',
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
      chartData: {},
    };
  },
  methods: {
    generateChartData() {
      const categories = Object.keys(this.totalAgentsByCategory);
      const data = categories.map(category => this.totalAgentsByCategory[category]);
      const backgroundColors = ['red', 'blue', 'green']; // Vous pouvez personnaliser les couleurs ici

      this.chartData = {
        labels: categories,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
        }],
      };
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
      const apiUrl = `http://10.1.44.176:3000/agents/${id}`;
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
      const apiUrl = `http://10.1.44.176:3000/gerer/manager/${id}`;
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
            const apiUrl = `http://10.1.44.176:3000/agents?category=${category}`;
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

  },
  created() {
    const id = this.$route.params.id;
    this.fetchAgentData(id);
    this.fetchManagerData(id);
    this.$nextTick(() => {
      this.generateChartData();
      });
  },
  mounted() {
    this.$nextTick(() => {
    if (this.chartData) {
      const ctx = document.getElementById('chart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: this.chartData,
        options: {}, // Ajoutez ici les options spécifiques au graphique si nécessaire
      });
    }
  });
},
};
</script>


<style >
/* Styles pour la dashboard-sidebar */
.dashboard {
  position: relative; /* Permet d'utiliser position: fixed sur les enfants */
}

.dashboard-sidebar {
  margin-top: 60px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background-color: #375561;
  color: white;
  padding: 10px;
  overflow-y: auto;
}

.sidebar-wrapper {
  margin-bottom: 20px;
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

.category-agents {
  font-size: 14px;
  color: white;
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
}
.dashboard-header {
   /* Laisse de l'espace pour la sidebar */
  background-color: #333;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-area: header;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #58b4df;
  color: white;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.total-agent:hover,
.total-document:hover {
  transform: scale(1.05);
}


.total-label {
  font-weight: bold;
  font-size: 18px;
}

.total-value {
  font-size: 24px;
  margin-top: 10px;
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