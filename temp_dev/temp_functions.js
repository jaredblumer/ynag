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
