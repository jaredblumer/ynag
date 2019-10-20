<template>
  <div id="app">

    <div class="container">

      <!-- Display loading message if loading goals -->
      <div v-if="loadGoals">
        <LoadGoals @loadGoalsComponent="loadGoalsComponent" />
      </div>

      <!-- Display error message if one occurs -->
      <!-- <div v-else-if="error">
        <h1>Oops!</h1>
        <p>{{error}}</p>
        <button @click="resetToken">Retry</button>
      </div> -->

      <!-- If no token, ask user to authorize -->
      <div v-if="!token">
        <div class="index-header">
          <h1>YNAG<span class="period">.</span></h1>
          <h3>You Need A Goal - A SuccessBot App</h3>
        </div>
        <div class="message" v-if="loggedOut">
          <p>You have successfully logged out.</p>
        </div>
        <div class="index-body">
          <!-- TODO: Add Image and Description Text -->
        </div>
        <div class="button-div">
          <button class="auth" @click="authorizeWithYNAB">Authorize with YNAB</button>
        </div>
      </div>

      <div class="goals-parent" v-else>
        <Goals
          :goals="goals"
          @logOut="logOut" />
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
import LoadGoals from './components/LoadGoals.vue';

export default {
  // Template data
  data () {
    return {
      // ynab: {
      //   clientId: config.ynab.clientId,
      //   redirectUri: config.ynab.redirectUri,
      //   token: null,
      //   api: null
      // },
      api: null,
      budgetId: 'default',
      budgets: [],
      clientId: config.ynab.clientId,
      error: null,
      goals: [],
      loadGoals: false,
      loggedOut: false,
      redirectUri: config.ynab.redirectUri,
      token: null,
      transaction: [],
      userId: null
    }
  },

  // When this component is created, check whether we need a token or budgets
  // or display the transactions
  created() {
    this.token = this.findYNABToken();
    if (this.token) {

      // Config axios
      axios.defaults.baseURL = 'https://api.youneedabudget.com/v1';
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;
      axios.defaults.headers.common['Content-Type'] = 'application/json';

      this.api = new ynab.api(this.token);

      this.loadGoals = true;
      console.log("this.loadGoals: " + this.loadGoals);

    }
  },

  methods: {

    // Build URI to retrieve access token
    authorizeWithYNAB(e) {
      e.preventDefault();
      const uri = `https://app.youneedabudget.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=token`;
      location.replace(uri);
    },

    convertMilliUnitsToCurrency(goalsObj) {
      for (let key in goalsObj) {
        if (key.match(/^(activity|balance|budgeted|goal_target)$/)) {
          goalsObj[key] = ynab.utils.convertMilliUnitsToCurrencyAmount(goalsObj[key], 2);
        }
      }
      return goalsObj;
    },

    fetchGoals(id) {
      console.log('fetch called');
      this.error = null;
      this.budgetId = "default";
      console.log('Budget ID:' + id);
      let token = sessionStorage.getItem('ynab_access_token');

      return axios.get('/budgets/' + this.budgetId + '/categories')
        .then((res) => {
          console.log(res.data.data.category_groups);
          return res.data.data.category_groups;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // Filter fetched goals to include only Target Category Balance by Date
    filterGoals(data) {
      console.log("filterGoals() called.")
      let tempGoalsArr = [];

      for (let i = 1; i < data.length; i++) {
        let categoryGroup = data[i].categories;

        for (let j = 0; j < categoryGroup.length; j++) {
          let category = categoryGroup[j];

          if (!category.deleted && !category.hidden && category.goal_type == ("TBD")) {
            tempGoalsArr.push(category);
          }
        }

      };

      tempGoalsArr = tempGoalsArr.map((goalsObj) => this.convertMilliUnitsToCurrency(goalsObj));

      console.log(tempGoalsArr);
      this.goals = tempGoalsArr;
      this.loadGoals = false;

    },

    // Find YNAB token by looking first in location.hash then sessionStorage
    findYNABToken() {
      console.log("findYNABToken() called.");
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

    // Get user ID
    getUserId() {
      console.log("getUserID() called");
      return axios.get('/user')
        .then((res) => {
          console.log("User ID: " + res.data.data.user.id);
          this.userId = res.data.data.user.id;
          return res.data.data.user.id;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // Run goals methods when LoadGoals component is created
    loadGoalsComponent() {
      console.log("loadGoalsComponent() called.")
      this.getUserId()
      .then(id => {
        return this.fetchGoals(id);
      })
      .then(data => {
        return this.filterGoals(data);
      });
    },

    // Clear the token and restart authorization
    logOut() {
      console.log("logOut() called.");
      this.loggedOut = true;
      this.token = null;
      this.error = null;
      this.goals = [];
      sessionStorage.removeItem('ynab_access_token');
    }

  },

  // Specify components available to template
  components: {
    Budgets,
    Goals,
    LoadGoals
  }
}
</script>

<style>

  html {
    height: 100vh;
  }

  body {
    min-height: 100vh;
  }

  #app {
    height: 100vh;
  }

  .auth {
    background-color: #F2783C;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 700;
    padding: 14px 14px;
    text-align: center;
    text-decoration: none;
  }
  .auth:active {
    /* TODO: Move button down slightly on click. */
  }
  .auth:hover {
    background-color: #ed580f;
    cursor: pointer;
  }
  body {
    background-color: #FFFFFF;
    font-family: 'Work Sans', sans-serif;
  }
  .button-div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .container {
    height: 100%;
  }
  .goals-parent {
    height: 100%;
  }
  h1 {
    color: #25384F;
    font-size: 50px;
    font-weight: 1000;
    margin: 0;
    padding: 0;
    text-align: center;
  }
  h3 {
    color: #85C3E9;
    font-size: 16px;
    font-weight: 1000;
    margin: 0;
    padding: 0;
    text-align: center;
  }
  .index-header {

  }
  .message {
    text-align: center;
  }
  .period {
    color: #85C3E9;
  }
</style>
