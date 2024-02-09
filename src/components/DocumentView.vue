<template>
  <div>
    <h1>{{ name }}</h1>
    <!-- Affichez ici les autres détails de l'utilisateur -->
    <button type="button" class="btn btn-primary" @click="goBack">Retour</button>
  </div>
</template>

<script>
export default {
  name: 'DocumentView',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script> 