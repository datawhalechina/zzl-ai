<template>
  <!-- <div> -->
    <svg :class="'w-icon '+className" aria-hidden="true" @click="$emit('click', $event)">
      <use :xlink:href="`#i-${name}`"></use>
    </svg>
  <!-- </div> -->
</template>
<script>
import './svg.js'

export default {
  name: "s-icon",
  props: ['name', 'className', 'color']
};
</script>
<style lang='scss' scoped>
.w-icon {
  height: 1em;
  width: 1em;
}
</style>