<template>
  <div class="document-view-container">
    <header class="dashboard-header full-width-header">
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
      <div class="cv-info">
        <div class="details">
          <p><strong>Noms :</strong> {{ employee.nom }} {{ employee.last_name }}</p>
          <p><strong>Grade :</strong> {{  employee.Grade ? employee.Grade.grade_name : "Unknown" }}</p>
          <p><strong>Fonction :</strong> {{ employee.fonction }}</p>
        </div>
      </div>

      <div class="file-upload-search">
        <div class="search">
          <input type="text" v-model="searchDocument" placeholder="Rechercher un document" class="form-control" @input="searchDocuments" />
        </div>
        <div class="actions">
          <button type="button" class="btn btn-primary btn-action" @click="showAddForm">Ajouter</button>
          <button type="button" class="btn btn-primary btn-action" @click="shareDocuments" v-if="selectedDocuments.length > 0">Partager</button>
          <button type="button" class="btn btn-primary btn-action" @click="selectDocuments" v-else>Sélectionner</button>
        </div>
      </div>
      <div v-if="showAddFormDialog" class="add-form-dialog" >
        <div class="add-form-content">
          <h2 class="form-title">Ajouter un fichier</h2>
          <button class="close-button" @click="closeForm">×</button>
          <form class="add-file-form" @submit.prevent="addFile" enctype="multipart/form-data">
            <div class="form-group">
              <label for="file-name">Nom du fichier</label>
              <select id="file-name" v-model="selectedDocumentType" class="form-control">
                <option value="">Sélectionner un type de document</option>
                <option v-for="type in documentTypes" :key="type.type_documentID" :value="type">{{ type.type_name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="file-upload">Importer le fichier</label>
              <input type="file" id="file-upload"  @change="handleFileUpload"  accept=".pdf,.png,.jpg,.jpeg" class="form-control-file" />
            </div>
            <div class="form-group text-right">
              <button type="submit" class="btn btn-primary">Valider</button>
            </div>
          </form>
        </div>
      </div>
      <div class="table-container">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Selection</th>
            <th scope="col">Document</th>
            <th scope="col">Type</th>
            <th scope="col">Date</th>
            <th scope="col">URL</th>
            <th scope="col">Impression</th>
          </tr>
        </thead>
        <tbody v-if="hasDocuments">
          <tr v-for="document in employee.documents" :key="document.nom">
            <td><input type="checkbox" v-model="selectedDocuments" :value="document"></td>
            <td>{{ document.designation }}</td>
            <td>{{ document.type }}</td>
            <td>{{ document.creation_date }}</td>
            <td><a :href="getFilePath(document.path)" target="_blank">{{ document.path}}</a></td>
            <td>
              <button class="btn btn-primary" @click="printFile(getFilePath(document.path))">
                <i class="fas fa-print"></i> Imprimer
              </button>
            </td>
          </tr>
        </tbody>
        <tr v-else>
          <td colspan="6">Aucun document enregistré.</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
//import { useRoute } from 'vue-router';
//import { ref } from 'vue';
//import employees from '@/../public/data.json';
//import { PDFJS } from 'pdfjs-dist';


export default {
  name: 'DocumentView',
  data() {
    return {
      employee: {
        documents: []
      },
      newDocumentName: '',
      showAddFormDialog: false,
      shareOptions: {
        email: false,
        social: false,
      },
      searchDocument: '',
      selectedDocuments: [],
      documentTypes: [],
      file: null,
      selectedDocumentType: {
      type_documentID: null,
      type_name: null,
      searchText: '',
      
    }
      
    };
  },
  created() {
    const name = this.$route.params.name;
    fetch('http://10.1.44.176:3000/agents')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        return response.json();
      })
      .then(data => {
        this.employee = data.find(emp => emp.nom === name);
        if (!this.employee) {
          console.log("L'employé n'a pas été trouvé");
        }
        // Récupérer les types de documents
        fetch('http://10.1.44.176:3000/type_documents/')
        .then(response => {
            if (!response.ok) {
              throw new Error('Erreur lors de la récupération des types de documents');
            }
            return response.json();
          })
          .then(data => {
            this.documentTypes = data;
          })
          .catch(error => {
            console.error("Une erreur s'est produite lors de la récupération des types de documents :", error);
          });
        // Interroger l'API des documents pour cet employé
        fetch(`http://10.1.44.176:3000/documents`)
          .then(response => {
            console.log('donne aget id', response)
              if (!response.ok) {
                  throw new Error('Erreur lors de la récupération des documents de l\'employé');
              }
              return response.json();
          })
          .then(data => {
              // Récupérer l'agentID de l'employé actuel
              const currentAgentID = this.employee.agentID;

            // Filtrer les documents en fonction de l'agentID actuel
            const filteredDocuments = data.filter(doc => doc.agentID === currentAgentID);

            // Affecter les documents filtrés à l'employé
            this.employee.documents = filteredDocuments;

            console.log(this.employee.documents);
          })
          /*
          .then(() => {
            // Rafraîchir la liste des documents
            this.refreshDocumentList();
          }) */
          .catch(error => {
              console.error("Une erreur s'est produite lors de la récupération des documents de l'employé :", error);
          });

      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
      });
  },
  computed: {
    hasDocuments() {
      return this.employee.documents && this.employee.documents.length > 0;
    },

  },
  methods: { /*
    searchInPDF() {
      const searchTerm = this.searchDocument.toLowerCase();

      // Parcourir tous les documents de l'employé
      for (const document of this.employee.documents) {
        // Vérifier si le fichier est un PDF
        if (document.type === 'PDF') {
          // Récupérer le chemin du fichier PDF
          const filePath = getFilePath(document.path);

          // Charger le fichier PDF
          PDFJS.getDocument(filePath)
            .promise.then(pdf => {
              // Parcourir les pages du PDF
              for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                // Extraire le texte de la page
                pdf.getPage(pageNum)
                  .then(page => page.getTextContent())
                  .then(textContent => {
                    // Vérifier si le terme de recherche se trouve dans le texte de la page
                    const pageText = textContent.items.map(item => item.str).join('').toLowerCase();
                    if (pageText.includes(searchTerm)) {
                      // Terme de recherche trouvé, faire quelque chose ici
                    }
                  });
              }
            })
            .catch(error => {
              console.error(`Une erreur s'est produite lors du chargement du fichier PDF ${filePath}:`, error);
            });
        }
      }
    },  */
    getGradeName(gradeID) {
      const employee = this.employees.find(employee => employee.gradeID === gradeID);
      return employee && employee.Grade ? employee.Grade.grade_name : 'Unknown';
    },
    filteredDocuments() {
      if (!this.searchDocument) {
        return this.employee.documents;
      }
      const searchTerm = this.searchDocument.toLowerCase();
      return this.employee.documents.filter(document => {
        return document.designation.toLowerCase().includes(searchTerm);
      });
    },
    searchDocuments() {
      if (this.searchDocument === '') {
        this.refreshDocumentList();
      } else {
        // Rafraîchissez les documents filtrés à chaque saisie
        this.employee.documents = this.filteredDocuments();
        //this.searchInPDF();
      }
    },
    printFile(filepath) {
      window.open(filepath, '_blank');
    },
    refreshDocumentList() {
    // Interroger le serveur pour récupérer la liste des documents pour l'employé actuel
    // Supposons que vous ayez une API qui renvoie les documents d'un employé en fonction de son ID
    fetch(`http://10.1.44.176:3000/documents`)
          .then(response => {
            console.log('donne aget id', response)
              if (!response.ok) {
                  throw new Error('Erreur lors de la récupération des documents de l\'employé');
              }
              return response.json();
          })
          .then(data => {
              // Récupérer l'agentID de l'employé actuel
              const currentAgentID = this.employee.agentID;

            // Filtrer les documents en fonction de l'agentID actuel
            const filteredDocuments = data.filter(doc => doc.agentID === currentAgentID);

            // Affecter les documents filtrés à l'employé
            this.employee.documents = filteredDocuments;
         });
    },
    
    shareDocuments() {
      // Votre logique de partage ici
      // Afficher la boîte de dialogue de partage
      this.showShareDialog = true;
    },
    cancelShare() {
      // Annuler le partage
      this.showShareDialog = false;
      this.shareOptions.email = false;
      this.shareOptions.social = false;
    },
    share() {
      // Logique de partage en fonction des options sélectionnées
      // Utilisez les valeurs de this.shareOptions pour déterminer les actions à effectuer

      // Exemple d'envoi par e-mail
      if (this.shareOptions.email) {
        // Votre code d'envoi par e-mail
      }

      // Exemple de partage sur les réseaux sociaux
      if (this.shareOptions.social) {
        // Votre code de partage sur les réseaux sociaux
      }

      // Réinitialiser les options et fermer la boîte de dialogue
      this.cancelShare();
    },
    goBack() {
    this.$router.push({ name: 'DossierView' });
    },
    handleLogout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push({ name: 'HelloWorld' });
    },
    closeForm() {
      this.file = null;
      this.newDocumentName = '';
      this.showAddFormDialog = false;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      console.log(file)
      this.file = file;

    },
    showAddForm() {
      this.showAddFormDialog = true;
    },
    getDate() {
      var date = new Date();
      const day = String(date.getDate()).padStart(2,'0');
      const month = String(date.getMonth() + 1).padStart(2,'0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    addFile() {
      const type_documentID = this.selectedDocumentType.type_documentID;
      const type_name = this.selectedDocumentType.type_name;
      console.log('type_documentID:', type_documentID);
      // Envoyer les données à votre API pour enregistrement
      if (this.file.name && this.file.type && this.getDate() && this.file) {
        
        const formData = new FormData();
        formData.append('agentID', this.employee.agentID);
        formData.append('managerID', this.$route.params.id);
        formData.append('type_documentID', type_documentID);
        formData.append('designation', type_name);
        formData.append('path', this.file);
        formData.append('creation_date', this.getDate());
        console.log( formData );

        fetch("http://10.1.44.176:3000/upload", {
          method: 'POST',
          body: formData
        })
          .then(response => {
            console.log('la reponse', response)
            if (!response.ok) {
              throw new Error('Erreur lors de l\'enregistrement du document');
            }
            return response.json();
            
          })
          .then(() => { 
            // Gérer la réponse du serveur ici
            console.log('Document enregistré avec succès');
            // Actualiser la liste des documents après l'enregistrement
            this.refreshDocumentList();
            
            // Fermer la boîte de dialogue
            this.closeForm();
            // Réinitialiser les champs
            this.file = null;
            this.newDocumentName = '';
            this.showAddFormDialog = false;
            alert('Enregistrement du document reussi')

          })
          .catch(error => {
            console.error('Une erreur s\'est produite lors de l\'enregistrement du document :', error);
            // Afficher un message d'erreur à l'utilisateur
            alert('Erreur lors de l\'enregistrement du document. Veuillez réessayer plus tard.');
            
          }); 
        }
    },
    
    getFilePath(filename) {
            // Vérifie si le chemin commence déjà par "uploads/"
        if (filename.startsWith('uploads/')) {
          // Si oui, retournez le chemin sans "uploads/" et spécifiez le port 3000
          return `http://10.1.44.176:3000/${filename.replace('uploads/', '')}`;
        } else {
          // Sinon, retournez le chemin tel quel et spécifiez le port 3000
          return `http://10.1.44.176:3000/${filename}`;
        }
    },
    selectDocument(document) {
    // Vérifier si le document est déjà sélectionné
    if (this.selectedDocuments.includes(document)) {
      // Désélectionner le document
      this.selectedDocuments = this.selectedDocuments.filter(d => d !== document);
    } else {
      // Sélectionner le document
      this.selectedDocuments.push(document);
    }
  },
  },
};
</script>


<style scoped>

.document-view-container {
  overflow-x: hidden;
  padding: 0; 
  margin: 0; 
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Aligne les éléments au début du conteneur */
  align-items: center;
  }

.dashboard-header {
  background-color: #333;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.full-width-header{
  width: 100%;
}
.d-flex  {
  display: flex;
  align-items: center;
  margin-right: auto;
}
.logout-button-wrapper {
  align-self: center;
}
.logout-button:hover {
  background-color: #cc0000;
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

.table-container {
  width: 70%;
  margin: 0 auto;
}

.table {
  width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        margin-top: 20px;
  
}

th, td {
  padding: 8px 12px;
  text-align: center;
  border: 1px solid #ddd;
}

th {
  background-color: #f7fafc;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}


.file-upload-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search {
  margin-right: 10px;
}

.actions {
  display: flex;
}

.btn-action {
  margin-right: 10px;
}

.add-form-dialog {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.add-form-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
}

.add-form-content h2 {
  margin-top: 0;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: red;
  border: none;
  color: white;
}
</style>