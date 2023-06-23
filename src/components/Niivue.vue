<script>
import {Niivue} from '@niivue/niivue'

export default {
  name: 'App',
  props: {
    volumeUrl: String,
  },
  data(){
    return {
      volumeList: [],
      nv: new Niivue(({show3Dcrosshair: true, backColor: [1, 1, 1, 1]}))
    }
  },
  methods:{
    async initializeVolumeList(){
        this.nv = new Niivue(({show3Dcrosshair: true, backColor: [1, 1, 1, 1]}))
        this.volumeList = [
            {
                url: this.volumeUrl,
                colorMap: "gray",
            }
        ]
        this.nv.setSliceType(this.nv.sliceTypeRender)//all three directions of slices are displayed if removed.
        this.nv.attachTo('gl')//attaches the entire image to the canvas.
        this.nv.setClipPlane([-0.1, 270, 0])//displays the clip plane. displaced in the x? direction by 0.1. rotated 270 degrees about the z axis. The third number clearly has to do with angle and initial position in the z direction but my experimentation is not leading me to a clear result.
        this.nv.loadVolumes(this.volumeList)//Displayes the brain.
    },
    async changeVolume(){
        this.volumeList = [
            {
                url: this.volumeUrl,
                colorMap: "gray",
            }
        ]
        this.nv.loadVolumes(this.volumeList)
        this.nv.updateGLVolume()
    }
  },
  mounted() {
    this.initializeVolumeList()
  },
}

</script>

<template>
    <div>HBN VIEWER</div>
    <canvas id="gl" width="1258" style="width: 100%; height: 100%;" height="1200" tabindex="0">
    </canvas>
</template>