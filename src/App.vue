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

      <div class="index" v-if="!token">
        <div class="index-container">
          <div class="index-header">
            <h1>YNAG<span class="period">.</span></h1>
            <h2>You Need A Goal</h2>
          </div>
          <div class="message" v-if="loggedOut">
            <p>You have successfully logged out.</p>
          </div>
          <div class="index-body">
            <div class="index-description">
              <div class="index-description-text">
                <p>
                  <strong>You Need A Goal</strong> is a free and secure third-party widget which
                  provides YNAB users with a quick, detailed overview of their
                  savings goals, all in one place.
                </p>
                <p class="privacy-policy">
                  You Need A Goal uses YNAB's authorized application interface to
                  securely transfer encrypted data directly to your browser. YNAG
                  does not store data nor request information from financial institutions.
                </p>
              </div>
            </div>
            <div class="button-div">
              <button @click="triggerModal">
                <span>View App</span>
              </button>
              <button class="auth" @click="authorizeWithYNAB">
                <span>Login</span>
              </button>

            </div>
          </div>
          <div class="index-footer">
            <span>
              Developed by <a href="https://github.com/jaredblumer">Jared Blumer</a>
            </span>
          </div>

          <div id="modal" class="modal">
            <div class="modal-content">
              <div class="modal-close-div">
                <button class="modal-close-button" @click="triggerModal">
                  <i id="modal-close" class="material-icons">close</i>
                </button>
              </div>
              <div class="modal-screenshot-div">
                <img src="@/assets/images/screenshot.png" />
              </div>
              <div class="modal-button-div">
                <button class="auth" @click="authorizeWithYNAB">
                  <span>Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Goals v-else
          :goals="goals"
          @logOut="logOut" />

    </div>
  </div>
</template>

<script>
import * as ynab from 'ynab';
import * as axios from 'axios';

// Import YNAB config
import config from './config.js';

// Import components
// import Budgets from './components/Budgets.vue';
import Goals from './components/Goals.vue';
import LoadGoals from './components/LoadGoals.vue';

export default {
  // Template data
  data () {
    return {
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

  created() {
    // Find YNAB Token or configure axios if token found
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

    convertKeys(goalsObj) {
      for (let key in goalsObj) {
        // Convert milliunits to currency for appropriate keys
        if (key.match(/^(activity|balance|budgeted|goal_target)$/)) {
          goalsObj[key] = ynab.utils.convertMilliUnitsToCurrencyAmount(goalsObj[key], 2);
        }
        if (key === "goal_target_month") {
          goalsObj[key] = this.formatTargetMonth(goalsObj[key]);
        }
      }
      return goalsObj;
    },

    fetchGoals(id) {
      console.log('fetch called');
      this.error = null;
      this.budgetId = "default";
      console.log('Budget ID:' + id);
      // let token = sessionStorage.getItem('ynab_access_token');

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

      }

      tempGoalsArr = tempGoalsArr.map((goalsObj) => this.convertKeys(goalsObj));

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

    formatTargetMonth(data) {
      let monthsObj = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
      };

      // Split data into array and reformat
      let splitData = data.split('-');
      let monthNum = splitData[1];
      let month = monthsObj[monthNum];
      let year = splitData[0];
      let targetDate = month + " " + year;
      return targetDate;
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
    },

    // Open or close modal
    triggerModal() {
      let modal = document.getElementById("modal");
      if (modal.style.display != "block") {
        modal.style.display = "block";
      } else {
        modal.style.display = "none";
      }
    }

  },

  // Specify components available to template
  components: {
    // Budgets,
    Goals,
    LoadGoals
  }
}
</script>

<style>

  body {
    background-color:#FEDBD0;
    color: black;
    font-family: 'Montserrat', sans-serif;
    margin: 0;
    padding: 0;
  }

  button {
    background-color: #666e8e;
    border: 0;
    border-radius: 3px;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    color: white;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    margin: 0 4px 0 4px;
    outline: 0;
    padding: 16px;
    transition: all 0.5s;
  }

  button:hover {
    background-color: #4e567d;
  }

  button span {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .button-div {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  html {
    margin: 0;
    padding: 0;
  }

  .index {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    position: absolute;
    width: 100%;
  }

  .index-body {
    background-color: #FFF;
    border-radius: 0.25rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    margin: 16px auto 8px auto;
    max-width: 600px;
    padding: 16px;
  }

  .index-container {
    margin: 0 auto 80px auto;
    padding: 16px;
    max-width: 600px;
  }

  .index-description {
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    display: inline-block;
    line-height: 26apx;
  }

  .index-description p {
    letter-spacing: 0.4px;
    margin: 0 0 16px 0;
  }

  .index-footer {
    text-align: center;
  }

  .index-footer span {
    color: #442C2E;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
  }

  .index-footer a {
    color: #442C2E;
  }

  .index-header {
    margin: 0;
  }

  .index-header h1 {
    color: #442C2E;
    font-size: 60px;
    font-weight: 600;
    letter-spacing: 6px;
    line-height: 50px;
    text-transform: uppercase;
    margin: 0;
    padding: 0;
  }

  .index-header h2 {
    color: #442C2E;
    font-size: 14px;
    letter-spacing: 2px;
    margin: 0 0 0 18px;
    padding: 0;
    text-transform: uppercase;
  }

  .modal {
    background-color: #666e8e; /* Fallback color */
    background-color: rgba(102,110,142,0.4);
    display: none;
    left: 0;
    height: 100%;
    overflow: auto;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
  }

  .modal-button-div {
    text-align: center;
  }

  #modal-close {
    color: white;
    font-size: 18px;
  }

  .modal-close-button {
    height: 24px;
    margin: 0;
    padding: 0;
    width: 24px;
  }

  .modal-close-div {
    margin: 0 auto;
    text-align: right;
    width: 500px;
  }

  .modal-content {
    margin: 50px 0 0 0;
  }

  .modal-content img {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    width: 500px;
  }

  .modal-screenshot-div {
    margin: 4px 0;
    padding: 0;
    text-align: center;
  }

  .privacy-policy {
    font-size: 12px;
  }

  @media only screen and (max-width: 500px) {

    .index-body {
      margin-top: 8px;
    }

    .index-container {
      margin: 0;
    }

    .modal-close-div {
      width: 95%;
    }

    .modal-content img {
      width: 95%;
    }
  }

</style>
