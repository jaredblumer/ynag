<template>
  <div class="container">
    <h1>Goals Loaded</h1>
  </div>
</template>

<script>
  // Import utils from YNAB
  import {utils} from 'ynab';

  export default {
    props: [],
    methods: {
      // Convert currency from utils
      convertMilliUnitsToCurrencyAmount: utils.convertMilliUnitsToCurrencyAmount
    }
  }
</script>
