/*
Example how to use Leaflet directly
*/

<template>
  <div id="placeholdermap" class="mapContainer">

  </div>
  <div>Map without vue-leaflet (use leaflet directly)</div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import { nextTick, onMounted, ref } from 'vue'
import L, { LeafletEventHandlerFn } from 'leaflet'
import { useMainStore } from './../stores/mainstore'
import { storeToRefs } from 'pinia'

// import { map, latLng, tileLayer, MapOptions } from 'leaflet'
const main = useMainStore()
const { locations } = storeToRefs(main)

const leafletMap = ref<L.Map>()

onMounted(() => {
  // Inject the leaflet map after the page is fully rendered
  nextTick(() => {
    initLeafletMap()
  })
})

const initLeafletMap = () => {
  // Find div element 'placeholdermap' in html and inject the leaflet map object
  leafletMap.value = L.map('placeholdermap', {
    crs: L.CRS.EPSG3415,
    center: new L.LatLng(30.498089, 104.072027),
    zoom: 15
  })

  // Example how to set center and zoom level (with intellisense)
  // leafletMap.value.setView([52.103839, 4.252742], 13 /* zoom level */)

  L.tileLayer('http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    maxZoom: 17
  }).addTo(leafletMap.value)

  L.tileLayer.wms('http://127.0.0.1:8080/geoserver/test/wms', { layers: 'roads', format: "image/png", transparent: true }).addTo(leafletMap.value)
  // L.marker([52.103839, 4.252742], { icon: customDivIcon }).addTo(leafletMap.value)

  // Add locations
  main.locations.forEach(loc => {
    if (leafletMap.value) {
      const marker = L.marker([loc.Latitude, loc.Longitude])
        .addTo(leafletMap.value)

        .bindTooltip(loc.Title, {
          permanent: true,
          offset: new L.Point(10, -25),
          direction: 'center',
          className: 'my-labels'
        })
        .bindPopup('Tooltip!<br> ' + loc.Title)
      if (marker.dragging) marker.dragging?.enable()
      // marker.on('dragend', (event: LeafletEventHandlerFn) => {
      //  const latlng = event.target.getLatLng()
      //  console.log(latlng.lat, latlng.lng)
      // })
    }
  })
  L.polygon(main.polygon.map(pnt => [pnt.Latitude, pnt.Longitude]), { color: 'red' }).addTo(leafletMap.value)

  const mypop = L.popup()
  const map = leafletMap.value
  map.on('click', function (e) {
    mypop
      .setLatLng(e.latlng)
      .setContent('你临幸了这个点：<br>' + e.latlng.toString())
      .openOn(map)
  })
}

</script>
<style>
.my-labels {
  background-color: transparent;
  border: transparent;
  box-shadow: none;
  font-weight: bold;
  font-size: 16px;
  color: red;
}
</style>

<style scoped>
.mapContainer {
  width: 6000px;
  height: 600px;
}
</style>
