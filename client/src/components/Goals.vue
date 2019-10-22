<template>
  <div class="goals-container">
    <!-- <button @click="budgetId = null">Select Another Budget</button> -->
    <!-- TODO: Add Select Another Budget Button -->

    <div class="goals-menu-container">
      <button v-on:click="$emit('logOut')">Log Out</button>
    </div>

    <div class="goals-body">
      <div v-for="goal in goals" v-bind:key="goal.id" class="goal-div">
        <h3>{{ goal.name }}</h3>
        <div class="goal-progress-container-left">
          <div>
            <span class="label">SAVED</span>
            <br>
            <span class="figure">{{ goal.balance }}</span>
          </div>
          <div>
            <span class="label">THIS MONTH</span>
            <br>
            <span class="figure">{{ goal.budgeted }}</span>
          </div>
        </div>

        <div class="goal-progress-container-center">
          <p><strong>{{ goal.goal_percentage_complete }}%</strong></p>
        </div>

        <div class="goal-progress-container-right">
          <span class="label">GOAL</span>
          <br>
          <span class="figure">{{ goal.goal_target }}</span>
          <div>
            <span class="label">AVERAGE</span>
            <br>
            <span class="figure">...</span>
          </div>
        </div>
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
  border-radius: 20px;
  margin: 8px;
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
