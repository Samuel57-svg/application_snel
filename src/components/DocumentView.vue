<template>
  <div>
    <div class="cv-info">
      <div class="photo">
        <img :src="employee.photo" alt="Photo" />
      </div>
      <div class="details">
        <p><strong>Nom :</strong> {{ employee.nom }}</p>
        <p><strong>Post-nom :</strong> {{ employee.post_nom }}</p>
        <p><strong>Fonction :</strong> {{ employee.fonction }}</p>
      </div>
    </div>

    <div class="row file-upload-search">
      <div class="col-md-6 search">
        <input type="text" v-model="search" placeholder="Rechercher un document" class="form-control" />
      </div>
      <div class="col-md-3">
        <button type="button" class="btn btn-primary btn-block" @click="showAddForm">Ajouter</button>
      </div>
      <div class="col-md-3 share-button">
        <button type="button" class="btn btn-primary btn-block" @click="shareDocuments">Partager</button>
      </div>
    </div>

    <!-- Formulaire d'ajout de fichier -->
    <div v-if="showAddFormDialog" class="add-form-dialog">
      <div class="add-form-content">
        <h2>Ajouter un fichier</h2>
        <form @submit.prevent="addFile">
          <div class="form-group">
            <label for="file-name">Nom du fichier</label>
            <input type="text" id="file-name" v-model="newFileName" class="form-control" />
          </div>
          <div class="form-group">
            <label for="file-upload">Importer le fichier</label>
            <input type="file" id="file-upload" @change="handleFileUpload" accept=".pdf,.png,.jpg,.jpeg" class="form-control-file" />
          </div>
          <div class="form-group text-right">
            <button type="submit" class="btn btn-primary">Valider</button>
          </div>
        </form>
      </div>
    </div>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th scope="col">Document</th>
          <th scope="col">Type</th>
          <th scope="col">Date</th>
          <th scope="col">URL</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="document in documents" :key="document.id">
          <td>{{ document.nom }}</td>
          <td>{{ document.type }}</td>
          <td>{{ document.date }}</td>
          <td>{{ document.url }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import data from '@/../public/data2.json';

export default {
  name: 'DocumentView',
  data() {
    return {
      documents: [],
    };
  },
  
  computed: {

    filteredDocuments() {
    const existingData = localStorage.getItem('data2');
    let existingArray = [];
    if (existingData) {
      existingArray = JSON.parse(existingData);
    }

    if (!this.search) {
      return existingArray;
    }

    return existingArray.filter(doc => doc.nom.toLowerCase().includes(this.search.toLowerCase()));
    }
  },
  methods: {
    closeForm() {
    this.newFileData = null;
    // Autres réinitialisations nécessaires
    },
    saveDataLocally() {
      const data = {
        agentID: "A0104",
        nom: this.employee.nom,
        post_nom: this.employee.post_nom,
        fonction: this.employee.fonction,
        nomDocument: this.newFileData.nom,
        typeDocument: this.newFileData.type,
        dateAjout: new Date().toLocaleDateString(),
        url: "" // Remplacez par le chemin d'accès du fichier
      };

      // Récupérez les données existantes du localStorage
      const existingData = localStorage.getItem('data2');
      let existingArray = [];
      if (existingData) {
        existingArray = JSON.parse(existingData);
      }

      // Ajoutez les nouvelles données au tableau existant
      existingArray.push(data);

      // Stockez les données mises à jour dans le localStorage
      localStorage.setItem('data2', JSON.stringify(existingArray));
    },
    

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const url = reader.result;
          const document = {
            nom: file.name,
            type: file.type,
            date: new Date().toLocaleDateString(),
            url: url
          };

          this.employee.documents.push(document);
          // Appelez la méthode pour enregistrer les données
          this.saveDataLocally();
        };
        reader.readAsDataURL(file);
      }
    },
    shareDocuments() {
      // Votre logique de partage ici
    },
    showAddForm() {
      this.showAddFormDialog = true;
    },
    addFile() {
      // Vérifier si les champs sont remplis
      if (this.newFileName && this.newFileData) {
        // Traiter l'ajout du fichier à la liste des documents de l'employé
        const document = {
          nom: this.newFileName,
          type: this.newFileData.type,
          date: new Date().toLocaleDateString(),
          url: this.newFileData.url
        };

        // Ajouter le document à la liste des documents de l'employé
        this.employee.documents.push(document);

        // Réinitialiser les champs
        this.newFileName = '';
        this.newFileData = null;

        // Fermer le formulaire d'ajout de fichier
        this.showAddFormDialog = false;
      }
    }

  },
  
  created() {
    this.documents = data;
    const name = this.$route.params.name;
    const employee = data.find(emp => emp.nom === name);

    if (employee) {
      this.employee = employee;
    }
  }
};
</script>

<style>

/* Styles CSS pour le formulaire d'ajout de fichier */
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

.add-form-dialog input[type="text"],
.add-form-dialog input[type="file"] {
  margin-bottom: 10px;
}

.add-form-dialog button[type="submit"] {
  width: 100%;
}

/* Styles CSS pour les boutons */
.btn-block {
  display: block;
  width: 100%;
}


.cv-info {
  display: flex;
  margin-bottom: 20px;
}

.cv-info .photo {
  width: 200px;
  height: auto;
  margin-right: 20px;
}

.cv-info .details {
  flex-grow: 1;
}

.cv-info p {
  margin: 0;
}

.file-upload-search {
  margin-bottom: 20px;
}

.file-upload-search .file-upload {
  padding-right: 10px;
}

.file-upload-search .search {
  padding-right: 10px;
}

.file-upload-search .share-button {
  display: flex;
  justify-content: flex-end;
}
</style>