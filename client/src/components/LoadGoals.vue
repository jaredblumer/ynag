<template>
  <div>
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
