// Use YNAB API to get list of budgets
getBudgets() {
  this.error = null;
  this.api.budgets.getBudgets().then((res) => {
    this.budgets = res.data.budgets;
  }).catch((err) => {
    this.error = err.error.detail;
  }).finally(() => {
    // this.loading = false;
  });
}
