<template>
  <div class="goals-container">
    <!-- <button @click="budgetId = null">Select Another Budget</button> -->
    <!-- TODO: Add Select Another Budget Button -->

    <div class="goals-menu-container">
      <button v-on:click="$emit('logOut')">Log Out</button>
    </div>

    <div class="goals-body">
      <h2>Goals</h2>

      <div v-for="goal in goals" v-bind:key="goal.id" class="goal-div">
        <h3>{{ goal.name }}</h3>
        <p><strong>{{ goal.goal_percentage_complete }}%</strong></p>
        <p>{{ goal.balance }} | {{ goal.goal_target }}</p>
      </div>

    </div>

  </div>

</template>

<script>
  export default {
    props: [
      'goals'
    ]
  }
</script>

<style>

.goal-div {
  border: 2px solid black;
  width: 700px;
}

.goals-body {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  flex: 1;
  flex-direction: column;
}

.goals-container {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  flex-direction: row;
}

.goals-menu-container {
  border: 2px solid green;
  flex: 0 0 300px;
}

</style>
