<template>
  <div id="app">

    <div class="container">

      <!-- Display loading message if loading -->
      <div v-if="loading">
        <Loading />
      </div>

      <!-- Display error message if one occurs -->
      <div v-else-if="error">
        <h1>Oops!</h1>
        <p>{{error}}</p>
        <button @click="resetToken">Retry</button>
      </div>

      <!-- If no token, ask user to authorize -->
      <div v-else-if="!ynab.token">
        <h1>Authorization</h1>
        <button @click="authorizeWithYNAB">Authorize</button>
      </div>

      <div v-else-if="!budgetId">
        <Goals />
        <!-- <button @click="budgetId = null">Select Another Budget</button> -->
        <!-- TODO: Add Select Another Budget Button -->
        <button @click="resetToken">Log Out</button>
      </div>

    <!-- <Footer /> -->

    </div>
  </div>
</template>

<script>
import * as ynab from 'ynab';
import * as axios from 'axios';

// Import YNAB config
import config from './config.js';

// Import components
import Budgets from './components/Budgets.vue';
import Goals from './components/Goals.vue';
import Loading from './components/Loading.vue';

export default {
  // Template data
  data () {
    return {
      ynab: {
        clientId: config.ynab.clientId,
        redirectUri: config.ynab.redirectUri,
        token: null,
        api: null
      },
      loading: false,
      error: null,
      budgetId: null,
      budgets: [],
      transaction: [],
      userId: null
    }
  },

  // When this component is created, check whether we need a token or budgets
  // or display the transactions
  created() {
    this.ynab.token = this.findYNABToken();
    if (this.ynab.token) {
      console.log('created() called');

      // Config axios
      axios.defaults.baseURL = 'https://api.youneedabudget.com/v1';
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.ynab.token;
      axios.defaults.headers.common['Content-Type'] = 'application/json';

      this.api = new ynab.api(this.ynab.token);

      if (!this.userId) {
        this.getUserId();
      } else {
        this.authorizeWithYNAB();
      }

      // if (!this.budgetId) {
      //   this.getBudgets();
      // } else {
      //   this.selectBudget(this.budgetId);
      // }
    }
  },

  methods: {

    // Build URI to retrieve access token
    authorizeWithYNAB(e) {
      e.preventDefault();
      const uri = `https://app.youneedabudget.com/oauth/authorize?client_id=${this.ynab.clientId}&redirect_uri=${this.ynab.redirectUri}&response_type=token`;
      location.replace(uri);
    },

    // Find YNAB token by looking first in location.hash then sessionStorage
    findYNABToken() {
      let token = null;
      const search = window.location.hash.substring(1).replace(/&/g, '","').replace(/=/g,'":"');
      if (search && search !== '') {
        // Try to get access_token from the has returned by OAuth
        const params = JSON.parse('{"' + search + '"}', function(key, value) {
          return key === '' ? value : decodeURIComponent(value);
        });
        token = params.access_token;

        sessionStorage.setItem('ynab_access_token', token);
        window.location.hash = '';
      } else {
        // Otherwise try sessionStage
        token = sessionStorage.getItem('ynab_access_token');
      }
      console.log("Bearer Token: " + token);
      return token;
    },

    // Clear the token and restart authorization
    resetToken() {
      sessionStorage.removeItem('ynab_access_token');
      this.ynab.token = null;
      this.error = null;
    }

  },

  // Specify components available to template
  components: {
    Budgets,
    Goals,
    Loading
  }
}
</script>
