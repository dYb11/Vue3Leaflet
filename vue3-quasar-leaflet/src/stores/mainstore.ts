import { defineStore } from 'pinia'
import { LocationInfo } from './../models/LocationInfo'
import { LatLon } from 'src/models/LatLon'

export type IMainStore = {

  locations: LocationInfo[];
  polygon: LatLon[];
};

export const useMainStore = defineStore('mainstore', {
  state: (): IMainStore => ({
    locations: [
      {
        Latitude: 30.939303715912658,
        Longitude: 103.9376021241749,
        Title: 'Point 1'
      },
      {
        Latitude: 30.942115279964472,
        Longitude: 103.94050278444783,
        Title: 'Point 2'
      }

    ],
    polygon: [
      {
        Longitude: 94.410976,
        Latitude: 29.57847
      },
      {
        Longitude: 94.411065,
        Latitude: 29.578201
      },
      {
        Longitude: 94.411305,
        Latitude: 29.578021
      },
      {
        Longitude: 94.413336,
        Latitude: 29.576781
      },
      {
        Longitude: 94.417463,
        Latitude: 29.574816
      },
      {
        Longitude: 94.418486,
        Latitude: 29.573041
      },
      {
        Longitude: 94.424678,
        Latitude: 29.568275
      },
      {
        Longitude: 94.428875,
        Latitude: 29.562281
      },
      {
        Longitude: 94.433153,
        Latitude: 29.556173
      }
    ]
  })

})
