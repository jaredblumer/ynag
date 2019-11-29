<template>
  <div class="goals-container">
    <!-- <button @click="budgetId = null">Select Another Budget</button> -->
    <!-- TODO: Add Select Another Budget Button -->

    <div class="goals-header">
      <h1>YNAG</h1>
      <h2>You Need a Goal</h2>
    </div>

    <div class="goals-body">

      <div class="goal-progress-container">
        <h3>Category Name</h3>
        <div class="progress-container">
          <div class="progress">
            <div class="progress-bar" style="width:40%"></div>
          </div>
          <div class="progress-percentage-div">
            <span class="percentage">40%</span>
          </div>
        </div>
      </div>


      <!-- <div v-for="goal in goals" v-bind:key="goal.id" class="goal-div">
        <h3>{{ goal.name }}</h3>
          <div class="goal-progress-container">

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
      </div> -->
    </div>
    <button v-on:click="$emit('logOut')">Log Out</button>
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

.goals-container {
  padding: 16px;
}

.goals-header h1 {
  color: #442C2E;
  font-size: 50px;
  font-weight: 600;
  letter-spacing: 6px;
  line-height: 36px;
  text-transform: uppercase;
  margin: 16px 0 0 0;
  padding: 0;
}

.goals-header h2 {
  color: #442C2E;
  font-size: 12px;
  letter-spacing: 2px;
  margin: 0 0 24px 12px;
  padding: 0;
  text-transform: uppercase;
}

.goal-progress-container h3 {
  color: #2c2f3d;
  margin: 0;
  padding: 0;
}

.goal-progress-container {
  background-color: #FFF;
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  margin: 16px 0;
  max-width: 600px;
  padding: 16px;
}

.percentage {
  color: #2c2f3d;
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
}

.progress {
  background-color: #f4f5f9;
  border: 1px solid #442C2E;
  margin: 8px 0px 8px 0px;
  width: calc(100% - 35px);
}

.progress-bar {
  background-color: #939ECC;
  border-right: 2px solid #2c2f3d;
  height: 20px;
}

.progress-container {
  display: flex;
}

.progress-percentage-div {
  align-items: center;
  display: flex;
}

</style>
