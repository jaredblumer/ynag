<template>
  <div class="container">
    <h1>Goals Loaded</h1>
    <!-- <button @click="budgetId = null">Select Another Budget</button> -->
    <!-- TODO: Add Select Another Budget Button -->
    <button v-on:click="$emit('logOut')">Log Out</button>
  </div>

</template>

<script>
  // Import utils from YNAB
  import {utils} from 'ynab';

  export default {
    created: function () {
      console.log('Goals Component Created');
      this.$emit('fetchGoals', 'default');
    },
    methods: {
      // Convert currency from utils
      convertMilliUnitsToCurrencyAmount: utils.convertMilliUnitsToCurrencyAmount
    }
  }
</script>
