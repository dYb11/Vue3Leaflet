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
        Latitude: 30.9399425,
        Longitude: 103.9387271
      },
      {
        Latitude: 30.939951,
        Longitude: 103.9388794
      },
      {
        Latitude: 30.9399522,
        Longitude: 103.9389804
      },
      {
        Latitude: 30.9400008,
        Longitude: 103.9432387
      },
      {
        Latitude: 30.9399958,
        Longitude: 103.9433432
      },
      {
        Latitude: 30.9400301,
        Longitude: 103.9489516
      },
      {
        Latitude: 30.9400548,
        Longitude: 103.9524436
      },
      {
        Latitude: 30.9401038,
        Longitude: 103.9532988
      },
      {
        Latitude: 30.9401606,
        Longitude: 103.9538005
      },
      {
        Latitude: 30.9402286,
        Longitude: 103.9541978
      },
      {
        Latitude: 30.9403786,
        Longitude: 103.9548494
      },
      {
        Latitude: 30.9405711,
        Longitude: 103.9555777
      },
      {
        Latitude: 30.9407859,
        Longitude: 103.9562378
      },
      {
        Latitude: 30.9417009,
        Longitude: 103.9583915
      }
    ]
  })

})
