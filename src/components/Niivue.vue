<script>
import {Niivue} from '@niivue/niivue'

export default {
  name: 'App',
  props: {
    scanType: String,
    allBundleLinks: Array,
    bundlesSelected: Array,
    dataset: Object,
    subjectId: Object,
    bundleTypes: Array
  },
  watch: {
    subjectId: function(newVal, oldVal) {
      if (newVal!=oldVal){
        if (typeof this.scanType != "undefined" && typeof this.scanType != "undefined"){
          this.changeVolume()
          if (this.bundlesSelected.length > 0){
            this.changeMeshes()
          }
        }
      }
    },
    scanType: function(newVal, oldVal) {
      if (newVal!=oldVal){
        if (typeof this.scanType != "undefined" && typeof this.scanType != "undefined"){
          this.changeVolume()
        }
      }
    },
    bundlesSelected: function(newVal, oldVal){
      if (newVal!=oldVal){
        if (typeof this.scanType != "undefined"){
          this.changeMeshes()
        }
      }
    }
  },
  data(){
    return {
      volumeList: [],
      nv: new Niivue(({show3Dcrosshair: true, backColor: [1, 1, 1, 1]})),
      controlsDisplayed:false,
      zoom: 0.1,
      colors: this.returnColorArray(),
    }
  },
  methods:{
    showControls(){
      this.controlsDisplayed=true
    },
    hideControls(){
      this.controlsDisplayed=false
    },
    initializeVolumeList(){
        this.nv = new Niivue(({show3Dcrosshair: true, backColor: [1, 1, 1, 1]}))

        const array = this.arrayBasedOnSubjectAndSite()
        this.volumeList = [
            {
                url: array[0],
                colorMap: "gray",
            }
        ]
        this.nv.setSliceType(this.nv.sliceTypeRender)//all three directions of slices are displayed if removed.
        this.nv.attachTo('gl')//attaches the entire image to the canvas.
        for (var q = 0; q<this.bundlesSelected.length; q++){
            this.nv.loadMeshes([{url: this.allBundleLinks[this.bundlesSelected[q]], rgba255: this.colors[q]}])
        }
        for (var q = 0; q<this.bundlesSelected.length; q++){
            this.nv.setMeshProperty(this.nv.meshes[q].id, "fiberColor", "Fixed")
        }
        this.nv.setClipPlane([-0.1, 270, 0])//displays the clip plane. displaced in the x? direction by 0.1. rotated 270 degrees about the z axis. The third number clearly has to do with angle and initial position in the z direction but my experimentation is not leading me to a clear result.
        this.nv.loadVolumes(this.volumeList)//Displayes the brain.
    },
    changeVolume(){
        console.log("arraysubsite:"+this.arrayBasedOnSubjectAndSite)
        this.volumeList = [
            {
                url: this.arrayBasedOnSubjectAndSite()[0],

                colorMap: "gray",
            }
        ]
        this.nv.loadVolumes(this.volumeList)
        this.nv.updateGLVolume()
    },
    changeZoom(){
      this.nv.scene.volScaleMultiplier = this.zoom*10;
      this.nv.drawScene()
    },
    arrayBasedOnSubjectAndSite(){
      const id = this.subjectId.id
      const site = this.subjectId.session
      const newArray = [this.dataset.prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_"+this.scanType+'.nii.gz']
      return newArray
    },
    async changeMeshes(){
      console.log('hellloooo')
      this.colorsSelected = []
      for (let j = 0; j < (this.bundlesSelected.length); j++){
        this.colorsSelected.push(this.colors[this.bundleTypes[this.bundlesSelected[j]].colorNumber])
      }
      var bundleUrls = []
      for (var q = 0; q<this.bundlesSelected.length; q++){
        bundleUrls.push({url: this.allBundleLinks[this.bundlesSelected[q]], rgba255: this.colorsSelected[q]})
      }
      await this.nv.loadMeshes(bundleUrls)//displays the fiber
      for (var q = 0; q<this.bundlesSelected.length; q++){
        await this.nv.setMeshProperty(this.nv.meshes[q].id, "fiberColor", "Fixed")
      }
      this.nv.drawScene()
    },
    returnColorArray(){
        const tableau_20 = [
            [0.12156862745098039, 0.4666666666666667, 0.7058823529411765],
            [0.6823529411764706, 0.7803921568627451, 0.9098039215686274],
            [1.0, 0.4980392156862745, 0.054901960784313725],
            [1.0, 0.7333333333333333, 0.47058823529411764],
            [0.17254901960784313, 0.6274509803921569, 0.17254901960784313],
            [0.596078431372549, 0.8745098039215686, 0.5411764705882353],
            [0.8392156862745098, 0.15294117647058825, 0.1568627450980392],
            [1.0, 0.596078431372549, 0.5882352941176471],
            [0.5803921568627451, 0.403921568627451, 0.7411764705882353],
            [0.7725490196078432, 0.6901960784313725, 0.8352941176470589],
            [0.5490196078431373, 0.33725490196078434, 0.29411764705882354],
            [0.7686274509803922, 0.611764705882353, 0.5803921568627451],
            [0.8901960784313725, 0.4666666666666667, 0.7607843137254902],
            [0.9686274509803922, 0.7137254901960784, 0.8235294117647058],
            [0.4980392156862745, 0.4980392156862745, 0.4980392156862745],
            [0.7803921568627451, 0.7803921568627451, 0.7803921568627451],
            [0.7372549019607844, 0.7411764705882353, 0.13333333333333333],
            [0.8588235294117647, 0.8588235294117647, 0.5529411764705883],
            [0.09019607843137255, 0.7450980392156863, 0.8117647058823529],
            [0.6196078431372549, 0.8549019607843137, 0.8980392156862745]]
        var rgbarray = []
        for (var i = 0; i<tableau_20.length; i++){
            var array = []
            for (var j = 0; j<3; j++){
                array.push(tableau_20[i][j]*255)
            }
            array.push(255)
            rgbarray.push(array)
        }
        return rgbarray
      }
  },
  mounted() {
    this.initializeVolumeList()
  },
}

</script>

<template>
    <label>Zoom: </label>
    <input type="range" min="0.01" max="0.5" step="0.01" class="slider" v-model="zoom" @change="changeZoom"/>
    <div>
      <canvas id="gl" width="1258" style="width: 100%; height: 100%;" height="1200" tabindex="0"></canvas>
    </div>
</template>