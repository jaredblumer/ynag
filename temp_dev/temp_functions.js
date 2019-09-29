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

// Select budget and retrieve goals
selectBudget(id) {
  console.log('selectBudget(id) called');
  this.loading = true;
  this.error = null;
  this.budgetId = id;
  console.log('Budget ID:' + id);
  let token = sessionStorage.getItem('ynab_access_token');

  axios.get('/budgets/' + this.budgetId + '/categories')
    .then((res) => {
      console.log(res.data.data.category_groups);
    })
    .catch((err) => {
      console.log(err);
    });
},

// Build URI to retrieve access token
authorizeWithYNAB(e) {
  e.preventDefault();
  const uri = `https://app.youneedabudget.com/oauth/authorize?client_id=${this.ynab.clientId}&redirect_uri=${this.ynab.redirectUri}&response_type=token`;
  location.replace(uri);
},

// Get user ID
getUserId() {
  axios.get('/user')
    .then((res) => {
      console.log("User ID: " + res.data.data.user.id);
    })
    .catch((err) => {
      console.log(err);
    });
},
