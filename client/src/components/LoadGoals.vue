<template>
  <div class='loading'>
    <h1>Loading</h1>
  </div>
</template>

<script>

  export default {
    created: function () {
      console.log('LoadGoals Component Created');
      this.$emit('loadGoalsComponent');
    }
  }

</script>

<style>
</style>
