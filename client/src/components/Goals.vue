<template>
  <div class="goals-container">
    <!-- <button @click="budgetId = null">Select Another Budget</button> -->
    <!-- TODO: Add Select Another Budget Button -->

    <div class="goals-menu-container">
      <button v-on:click="$emit('logOut')">Log Out</button>
    </div>

    <div class="goals-body">
      <h2>Goals</h2>

      <div v-for="goal in goals">
        <h3>{{ goal.name }}</h3>
        <p><strong>{{ goal.goal_percentage_complete }}%</strong></p>
        <p>{{ goal.balance }} | {{ goal.goal_target }}</p>
      </div>

    </div>

  </div>

</template>

<script>
  // Import utils from YNAB
  import {utils} from 'ynab';

  export default {
    props: [
      'goals'
    ],
    methods: {
      // Convert currency from utils
      convertMilliUnitsToCurrencyAmount: utils.convertMilliUnitsToCurrencyAmount
    }
  }
</script>

<style>

.goals-body {
  border: 2px solid black;
  height: 100vh;
  flex: 1;
}

.goals-container {
  display: -ms-flex;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.goals-menu-container {
  border: 2px solid green;
  flex: 0 0 300px;
  height: 100vh;
}

</style>
