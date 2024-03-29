/*
Example how to use Leaflet directly
*/

<template>
<div class="row mapContainer">
  <div class="col-2">
    <form @submit.prevent="simulateSubmit" class="q-pa-md">
    <!-- a simple text field watching for the enter key release -->
    <q-input
      filled
      autogrow
      color="teal"
      hint="数组 ts Longitude  Latitude"
      id="textInput"
      v-model="textInput"
    />
    <div class="row justify-end">
      <q-btn
        type="submit"
        @click="handleSubmit"
        label="Save"
        class="q-mt-md"
        color="teal"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </div>
  </form>
  </div>
  <div id="placeholdermap"  class="col-10">two thirds</div>
</div>
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
    center: new L.LatLng(29.57847, 94.410976),
    zoom: 15
  })

  // Example how to set center and zoom level (with intellisense)
  // leafletMap.value.setView([52.103839, 4.252742], 13 /* zoom level */)

  L.tileLayer('http://t0.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=eec8c7ee00d8d62dd60a274aa1a1beb5', {
  // L.tileLayer('http://localhost:28080/tile/{z}/{x}/{y}.png', {
  // L.tileLayer('http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    maxZoom: 17
  }).addTo(leafletMap.value)

  // L.tileLayer.wms('http://localhost:8080/geoserver/test/wms', { layers: 'roads', format: 'image/png', transparent: true }).addTo(leafletMap.value)
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
  // 渲染线
  // L.polyline(main.polygon.map(pnt => [pnt.Latitude, pnt.Longitude]), { color: 'red' }).addTo(leafletMap.value)

  const mypop = L.popup()
  const level = 14
  const map = leafletMap.value
  map.on('click', function (e) {
    console.log(e.latlng)
    // level = level - 1
    e.latlng.level = level

    // api.get('/juc/s2/getS2Vertex', {
    //   params: e.latlng
    // }).then(response => {
    //   const res = []
    //   const element = response.data
    //   const ll = [[element.lat0, element.lng0], [element.lat1, element.lng1], [element.lat2, element.lng2], [element.lat3, element.lng3]]
    //   L.polygon(
    //     ll,
    //     {
    //       color: 'red',
    //       weight: 1,
    //       fillOpacity: 0.5
    //     }
    //   ).addTo(map)
    // })

    // api.get('/juc/s2/getS2Conver', {
    //   params: e.latlng
    // }).then(response => {
    //   const res = []
    //   response.data.forEach(element => {
    //     const ll = [[element.lat0, element.lng0], [element.lat1, element.lng1], [element.lat2, element.lng2], [element.lat3, element.lng3]]
    //     L.polygon(
    //       ll,
    //       {
    //         color: 'red',
    //         weight: 1,
    //         fillOpacity: 0.5
    //       }
    //     ).addTo(map)
    //   })
    // })

    api.get('/juc/s2/getS2Line', {
      params: e.latlng
    }).then(response => {
      const res = []
      response.data.forEach(element => {
        const coordinates = element.coordinates
        console.log(coordinates)

        L.polyline(coordinates.map(pnt => [pnt.Latitude, pnt.Longitude]), { color: 'green' }).addTo(leafletMap.value)
      })
    })

    // mypop
    //   .setLatLng(e.latlng)
    //   .setContent('你临幸了这个点：<br>' + e.latlng.toString())
    //   .openOn(map)
  })

  // api.get('/match/v1/car/94.410976,29.57847;94.411065,29.578201;94.411305,29.578021;94.413336,29.576781;94.417463,29.574816;94.418486,29.573041;94.424678,29.568275;94.428875,29.562281;94.433153,29.556173?timestamps=1710737329;1710737333;1710737336;1710737354;1710737397;1710737414;1710737474;1710737534;1710737594&geometries=geojson&tidy=true', {
  // }).then(response => {
  //   const res = []
  //   console.log(response.data.matchings[0].geometry.coordinates)
  //   L.polyline(response.data.matchings[0].geometry.coordinates.map(pnt => [pnt[1], pnt[0]]), { color: 'orange' }).addTo(leafletMap.value)
  // })

  const data = { level: 20, id: 319625237 }

  api.get('/juc/s2/getS2ById', {
    params: data
  }).then(response => {
    const res = []
    response.data.forEach(element => {
      const ll = [[element.lat0, element.lng0], [element.lat1, element.lng1], [element.lat2, element.lng2], [element.lat3, element.lng3]]
      L.polygon(
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

const textInput = ref('')

const handleSubmit = () => {
  console.log('提交的文本是：', textInput.value)
  let lnglat = ''
  let ts = ''
  const data1: { lng: any; lat: any }[] = []

  const data = textInput.value.split('\n')
  console.log(data)

  graphHopperMatch(data)

  data.forEach(d => {
    const r = d.split('\t')
    lnglat = lnglat + r[1] + ',' + r[2] + ';'
    ts = ts + r[0] + ';'
    data1.push({ lng: r[1], lat: r[2] })
  })

  // 重置中心点
  leafletMap.value.setView([data1[data1.length - 1].lat, data1[0].lng], leafletMap.value.getZoom())

  lnglat = lnglat.slice(0, -1)
  ts = ts.slice(0, -1)
  console.log(ts)
  console.log(lnglat)

  // 画原始轨迹
  L.polyline(data1.map((pnt: { lat: any; lng: any }) => [pnt.lat, pnt.lng]), { color: 'black' }).addTo(leafletMap.value)

  // osrm
  // api.get('/match/v1/car/' + lnglat + '?geometries=geojson&tidy=true', {
  //   params: { timestamps: ts }
  // }).then(response => {
  //   const res = []
  //   console.log(response.data.matchings[0].geometry.coordinates)
  //   L.polyline(response.data.matchings[0].geometry.coordinates.map((pnt: any[]) => [pnt[1], pnt[0]]), { color: 'red' }).addTo(leafletMap.value)
  // })
}

function graphHopperMatch (data) {
  let pp = ''
  data.forEach(d => {
    const r = d.split('\t')

    const node = '<trkpt>' +
                  '<time>' + r[0] + '000' + '</time>' +
                  '<lat>' + r[2] + '</lat>' +
                  '<lon>' + r[1] + '</lon>' +
                  '</trkpt>'
    pp = pp + node
  })

  const requestData = `
  <Gpx>
      <trk>
          <trkseg>` + pp + `</trkseg>
          <name>My Run</name>
      </trk>
  </Gpx>
  `

  console.log(requestData)

  // GraphHopper match
  const axiosSettings = {
    method: 'post',
    url: '/match?profile=car&type=json&points_encoded=false',
    headers: {
      'Content-Type': 'application/gpx+xml'
    },
    data: requestData,
    timeout: 60000
  }

  api(axiosSettings)
    .then(response => {
      console.log(response.data)
      L.polyline(response.data.paths[0].points.coordinates.map((pnt: any[]) => [pnt[1], pnt[0]]), { color: 'red' }).addTo(leafletMap.value)
    })
    .catch(error => {
      console.error(error)
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
  width: 1600px;
  height: 800px;
}
</style>
