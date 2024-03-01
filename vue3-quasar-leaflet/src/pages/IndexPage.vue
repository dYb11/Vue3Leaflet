<template>
  <div class="container">
    <div class="column">
      <RawLeafletMap></RawLeafletMap>
    </div>

    <div class="column">
      <VueLeafletMap></VueLeafletMap>
    </div>
  </div>
</template>

<script setup>
import RawLeafletMap from './../components/MyRawLeafletMap.vue'

</script>

<style>
.container {
  display: flex;
  gap: 10px;
}

.column {
  flex-basis: 100%;
}
</style>
