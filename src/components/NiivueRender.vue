<template>
    <div id="app">
        <div id = "canvas-container">
            <canvas id="gl">Your system doesn't support canvas</canvas>
        </div>
        <div class="bottom-bar">
            <div class="tooltip">
                <ToolTip :tip="tip">Controls</ToolTip>
            </div>
            <div class="zoom">
                    Zoom: <input type="range" min="0.01" max="0.5" step="0.01" v-model="zoom" @input="changeZoom"/>
            </div>
            <button id="download" @click = "downloadNifti" >Download NIFTI file</button>
        </div>
    </div>
</template>

<style>
#app{
    display: grid;
}
#canvas-container{
    width: 110vh;
    height: 93vh;
}
#gl{
    align-self: left;
    border: black 1px solid;
}
.bottom-bar{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>

<script setup>
import ToolTip from './ToolTip.vue';
import {Niivue} from '@niivue/niivue'
import {onMounted,watch} from 'vue';
import {getUrl} from '../utilites/awsHelper.js'

const props = defineProps({
    dataset:{
        type:Object,
        required: true,
        validatior: (value) => {
            return value.hasOwnProperty("bucket") && value.hasOwnProperty("prefix");
        }
    },
    //bundles needs to be updated to accept tks and trxs
    bundles:{
        type: Array,
        required: false
    },
    scan: {}
})

var nv = null
var isLoadingVolume = false
var zoom = 0.1
const tip = "C = Cycle Clip Plane | V = Cycle Slice Type | H,L,J,K = rotation | Scroll = move clip plane | Right Click = rotate clip plain | Left Click = rotate camera"

onMounted(() => {
  nv = new Niivue(({show3Dcrosshair: true, backColor: [1, 1, 1, 1]}));
  nv.attachTo("gl");
  nv.setSliceType(nv.sliceTypeMultiplanar);
  nv.setClipPlane([-0.1, 270, 0])
});

async function updateVolume(){
    if(!isLoadingVolume){
        isLoadingVolume = true
        let params = {
            Bucket: props.dataset.bucket,
            Key: props.scan.path,
        }
        let volumeList = [{url: await getUrl(params),colorMap: "gray",}]
        await nv.loadVolumes(volumeList)
        await nv.updateGLVolume()
        isLoadingVolume = false
        return

    }
}

function deleteTrkBundles(bundles){
    for(let i = 0; i < bundles.length; i++){
        let params = {
            Bucket: props.dataset.bucket,
            Key: bundles[i].filepath
        }
        let url = getUrl(params)
        nv.removeMeshByUrl(url)
    }
}

async function loadTrkBundle(bundle){
  if (!nv.initialized) {
    await nv.init();
  }

  if (nv.gl) {
    let params = {
        Bucket: props.dataset.bucket,
        Key: bundle.filepath
    }
    let url = getUrl(params)
    console.log(params,url)
    let color = bundle.rgba255
    let meshOptions = {url:url, rgba255: color, gl: nv.gl}
    await nv.addMeshFromUrl(meshOptions);
    return
  } else {
    console.error('WebGL context is not initialized');
  }
}

async function updateTrkBundles(newBundles,oldBundles){
    const removedBundles = oldBundles.filter(item => !newBundles.includes(item))
    const addedBundles = newBundles.filter(item => !oldBundles.includes(item))
    console.log(addedBundles)

    if(removedBundles.length > 0){
        deleteTrkBundles(removedBundles)
    }

    if(addedBundles.length > 0){
        for(let i=0;i<addedBundles.length;i++){
            let bundle = addedBundles[i]
            await loadTrkBundle(bundle)
        }
    }
    for(let i=0; i<nv.meshes.length;i++){
                await nv.setMeshProperty(nv.meshes[i].id, "fiberColor","Fixed")
    }

}
watch(() => props.scan, async (newVal) => {
    if(props.scan){
        await updateVolume()
    }
})

watch(() => props.bundles, async (newVal,oldVal) => {
    updateTrkBundles(newVal,oldVal)
})
</script>