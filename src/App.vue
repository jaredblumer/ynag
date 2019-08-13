<template>
  <div id="app">
    <!-- <Nav /> -->
    <div class="container">

      <!-- Display loading message if loading -->
      <h1 v-if="loading">Loading...</h1>

      <!-- Display error message if one occurs -->
      <div v-if="error">
        <h1>Oops!</h1>
        <p>{{error}}</p>
        <button @click="resetToken">Retry</button>
      </div>

      <!-- Otherwise, show app contents -->
      <div v-else>

        <!-- If no token, ask user to authorize -->
        <div v-if="!ynab.token">
          <h1>Authorization</h1>
          <button @click="authorizeWithYNAB">Authorize</button>
        </div>

        <Budgets v-else-if="!budgetId" :budgets="budgets" :selectBudget="selectBudget" />

        <div v-else>
          <Transactions :transactions="transactions" />
          <button @click="budgetId = null">Select Another Budget</button>
        </div>

      </div>

    <!-- <Footer /> -->

    </div>
  </div>
</template>

<script>
import * as ynab from 'ynab';

// Import YNAB config
import config from './config.json';

// Import components
import Budgets from './components/Budgets.vue';
import Transactions from './components/Transactions.vue';

export default {
  // Template data
  data () {
    return {
      ynab: {
        clientId: config.clientId,
        redirectUri: config.redirectUri,
        token: null,
        api: null
      },
      loading: false,
      error: null,
      budgetId: null,
      budgets: [],
      transaction: []
    }
  },

  // When this component is created, check whether we need a token or budgets
  // or display the transactions
  created() {
    this.ynab.token = this.findYNABToken();
    if (this.ynab.token) {
      console.log('created() called');
      this.api = new ynab.api(this.ynab.token);
      if (!this.budgetId) {
        this.getBudgets();
      } else {
        this.selectBudget(this.budgetId);
      }
    }
  },

  methods: {
    // Use YNAB API to get list of budgets
    getBudgets() {
      this.loading = true;
      this.error = null;
      this.api.budgets.getBudgets().then((res) => {
        this.budgets = res.data.budgets;
      }).catch((err) => {
        this.error = err.error.detail;
      }).finally(() => {
        this.loading = false;
      });
    },

    // Select budget and retrieve transactions
    selectBudget(id) {
      console.log('selectBudget(id) called');
      this.loading = true;
      this.error = null;
      this.budgetId = id;
      this.transaction = [];
      this.api.transactions.getTransactions(id).then((res) => {
        this.transactions = res.data.transactions;
      }).catch((err) => {
        this.error = err.error.detail;
      }).finally(() => {
        this.loading = false;
      });
    },

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
      console.log(token);
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
    Transactions
  }
}
</script>
