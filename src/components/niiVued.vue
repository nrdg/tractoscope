<template>
    <div id = 'niivueVue'>
      <main id="container">
        <canvas id="gl1" width="1258" style="width: 100%; height: 80%;" height="700" tabindex="0">
        </canvas>
      </main>
      <label>Controls: </label>
      <ul>
        <li>Scroll to move the clip plane along the default axis. </li>
        <li>Left Click and move the mouse to rotate the camera around.</li>
        <li>Right Click and move the mouse to rotate the clip plane.</li>
        <li>Click C to cycle through the default clip plane options. The final option is no clip plane. Zooming is possible in that state by scrolling.</li>
        <li>Click V to cycle through the default slice type options.</li>
        <li>Pressing H or L rotates the scene in opposite directions about the vertical axis.</li>
        <li>Pressing J or K rotates the scene in opposite directions about one of the horizontal axes.</li>
      </ul>
    </div>
</template>

<script>
module.exports= {
  data(){
    return{
      nv1: new niivue.Niivue(({show3Dcrosshair: true, backColor: [1, 1, 1, 1]})),
      volumeList1:[]
    }
  },
  methods:{
    async initializeVolumeList(subjectData, colors){
      this.nv1 = new niivue.Niivue(({show3Dcrosshair: true, backColor: [1, 1, 1, 1]}))
      this.volumeList1 = [
        // first item is background image
        {
          url: subjectData[0][0],
          colorMap: "gray",
        }
      ]
      this.nv1.setSliceType(this.nv1.sliceTypeRender)//all three directions of slices are displayed if removed.
      this.nv1.attachTo('gl1')//attaches the entire image to the canvas.
    bundleUrls = []
    for (var q = 0; q<subjectData[1].length; q++){
          bundleUrls.push({url: subjectData[0][1][subjectData[1][q]], rgba255: colors[q]})
      }
    await this.nv1.loadMeshes(bundleUrls)//displays the fiber
    for (var q = 0; q<subjectData[1].length; q++){
          this.nv1.setMeshProperty(this.nv1.meshes[q].id, "fiberColor", "Fixed")
      }
      this.nv1.setClipPlane([-0.1, 270, 0])//displays the clip plane. displaced in the x? direction by 0.1. rotated 270 degrees about the z axis. The third number clearly has to do with angle and initial position in the z direction but my experimentation is not leading me to a clear result.
      this.nv1.loadVolumes(this.volumeList1)//Displayes the brain.
    },
  changeVolume(volumeUrl){
    this.volumeList1[0].url = volumeUrl;
    this.nv1.loadVolumes(this.volumeList1);
    if (checkboxVueApp.bundles.length == 0){
      this.nv1.drawScene();
    }
    },
  async changeMeshes(subjectData, colors){
    bundleUrls = []
    for (var q = 0; q<subjectData[1].length; q++){
        bundleUrls.push({url: subjectData[0][1][subjectData[1][q]], rgba255: colors[q]})
      }
    await this.nv1.loadMeshes(bundleUrls)//displays the fiber
    for (var q = 0; q<subjectData[1].length; q++){
        await this.nv1.setMeshProperty(this.nv1.meshes[q].id, "fiberColor", "Fixed")
      }
    this.nv1.drawScene()
    },
  changeZoom(zoom){
    this.nv1.scene.volScaleMultiplier = zoom*10;
    this.nv1.loadVolumes(this.volumeList1)
    } 
  }
}
</script>
