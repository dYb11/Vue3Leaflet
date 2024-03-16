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
import { api } from 'boot/axios'

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
    center: new L.LatLng(30.940026, 103.939601),
    zoom: 15
  })

  // Example how to set center and zoom level (with intellisense)
  // leafletMap.value.setView([52.103839, 4.252742], 13 /* zoom level */)

  L.tileLayer('http://t0.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=eec8c7ee00d8d62dd60a274aa1a1beb5', {
  // L.tileLayer('http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    maxZoom: 17
  }).addTo(leafletMap.value)

  L.tileLayer.wms('http://localhost:8080/geoserver/test/wms', { layers: 'roads', format: 'image/png', transparent: true }).addTo(leafletMap.value)
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
  L.polyline(main.polygon.map(pnt => [pnt.Latitude, pnt.Longitude]), { color: 'red' }).addTo(leafletMap.value)

  const mypop = L.popup()
  let level = 15
  const map = leafletMap.value
  map.on('click', function (e) {
    console.log(e.latlng)
    level = level - 1
    e.latlng.level = level

    api.get('/juc/s2/getS2Vertex', {
      params: e.latlng
    }).then(response => {
      const res = []
      const element = response.data
      const ll = [[element.lat0, element.lng0], [element.lat1, element.lng1], [element.lat2, element.lng2], [element.lat3, element.lng3]]
      L.polygon(
        ll,
        {
          color: 'red',
          weight: 1,
          fillOpacity: 0.5
        }
      ).addTo(map)
    })
    // mypop
    //   .setLatLng(e.latlng)
    //   .setContent('你临幸了这个点：<br>' + e.latlng.toString())
    //   .openOn(map)
  })
  const data = { level: 20, id: 319625237 }

  api.get('/juc/s2/getS2ById', {
    params: data
  }).then(response => {
    const res = []
    response.data.forEach(element => {
      const ll = [[element.leftLat, element.leftLng], [element.rightLat, element.rightLng]]
      L.rectangle(
        ll,
        {
          color: 'red',
          weight: 1,
          fillOpacity: 0.5
        }
      ).addTo(map)
      console.log(ll)
    })
  })

  L.rectangle(
    [
      [30.939303715912658, 103.9376021241749],
      [30.942115279964472, 103.94050278444783]
    ],
    {
      color: 'red',
      weight: 1,
      fillOpacity: 0.5
    }
  ).addTo(map)
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
  width: 1200px;
  height: 600px;
}
</style>
