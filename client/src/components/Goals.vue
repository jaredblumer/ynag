<template>
  <div>

    <nav id="nav">
      <ul>
        <a href="#" v-on:click="$emit('logOut')"><li>Log Out</li></a>
      </ul>
    </nav>

    <div class="goals-container">
      <!-- <button @click="budgetId = null">Select Another Budget</button> -->
      <!-- TODO: Add Select Another Budget Button -->

      <div class="goals-header">
        <div>
          <h1>YNAG</h1>
          <h2>You Need a Goal</h2>
        </div>
        <div class="drop-down">
          <i class="material-icons" id="drop-down-arrow">keyboard_arrow_down</i>
        </div>
      </div>

      <div class="goals-body">

        <div class="goal-progress-container" v-for="goal in goals" v-bind:key="goal.id">
          <h3>{{ goal.name }}</h3>
          <div class="progress-container">
            <div class="progress">
              <div class="progress-bar" v-bind:style="{ width: goal.goal_percentage_complete + '%'}"></div>
            </div>
            <div class="progress-percentage-div">
              <span class="percentage">{{ goal.goal_percentage_complete }}%</span>
            </div>
          </div>
          <!-- <div class="drop-down-container">
            <i class="material-icons">unfold_more</i>
          </div> -->
          <div class="details-container">
            <div class="details-row-container">
              <div class="detail-div">
                <h4>Saved</h4>
                <span>$ {{ goal.balance }}</span>
              </div>
              <div class="detail-div">
                <h4>This Month</h4>
                <span>$ {{ goal.budgeted }}</span>
              </div>
            </div>
            <div class="details-row-container">
              <div class="detail-div">
                <h4>Goal</h4>
                <span>$ {{ goal.goal_target }}</span>
              </div>
              <div class="detail-div">
                <h4>Est. Completed</h4>
                <span>TO-DO</span>
              </div>
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
    </div>
  </div>
</template>

<script>
  export default {
    mounted() {
      let dropDownArrow = document.getElementById("drop-down-arrow");
      let nav = document.getElementById("nav");
      dropDownArrow.addEventListener("click", dropDown);
      function dropDown() {
        // if ()
        dropDownArrow.classList.toggle("rotated");
        nav.classList.toggle("visible");
      }
    },

    props: [
      'goals'
    ]
  }
</script>

<style>

.details-row-container {
  align-content: space-between;
  display: flex;
  flex-direction: row;
}

.detail-div {
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  margin: 2px;
  padding: 16px;
  text-align: center;
  width: calc(50% - 8px);
}

.detail-div h4 {
  font-weight: 400;
  font-size: 12px;
  margin: 0 0 2px 0;
  padding: 0;
}

.drop-down {
  margin: 8px 0 0 0;
}

#drop-down-arrow {
  color: #442C2E;
  cursor: pointer;
  font-size: 30px;
  transition: all ease 0.4s;
}

.drop-down-container {
  text-align: center;
}

.goals-container {
  padding: 16px;
}

.goals-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  color: #442C2E;
  font-size: 26px;
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

nav {
  background-color: #666e8e;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin: -53px 0 0 0;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  transition: all 0.5s;
}

nav a {
  color: white;
  text-decoration: none;
}

nav li {
  padding: 16px 0 16px 0;
  transition: background-color 0.5s ease;
}

nav li:hover {
  background-color: #4e567d;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.visible {
  margin: 0;
}

.percentage {
  color: #442C2E;
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
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
  background-color: #666e8e;
  border-right: 1px solid #2c2f3d;
  height: 20px;
}

.progress-container {
  display: flex;
}

.progress-percentage-div {
  align-items: center;
  display: flex;
}

.rotated {
  transform: rotate(180deg);
}

</style>
