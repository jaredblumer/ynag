<template>
  <div class="container">
    <h5>Transactions</h5>
    <table>
      <thead>
        <tr>
          <th>Account</th>
          <th>Date</th>
          <th>Payee</th>
          <th>Category</th>
          <th>Memo</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" v-bind:key="transaction.id">
          <td>{{transaction.account_name}}</td>
          <td>{{transaction.date}}</td>
          <td>{{transaction.payee_name}}</td>
          <td>{{transaction.category_name}}</td>
          <td>{{transaction.memo}}</td>
          <td>{{convertKeys(transaction.amount).toFixed(2)}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  // Import utils from YNAB
  import {utils} from 'ynab';

  export default {
    props: ['transactions'],
    methods: {
      // Convert currency from utils
      convertMilliUnitsToCurrencyAmount: utils.convertMilliUnitsToCurrencyAmount
    }
  }
</script>
