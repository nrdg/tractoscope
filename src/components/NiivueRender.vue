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


<script setup>
import ToolTip from './ToolTip.vue';
import {Niivue} from '@niivue/niivue'
import {onMounted,watch} from 'vue';

import { useDataStore } from '../utilites/dataStore.js'

const dataStore = useDataStore()

var nv = null
var isLoadingVolume = false
var volumeToLoad = null
var bundleToLoad = null
var zoom = 0.1
const tip = "C = Cycle Clip Plane | V = Cycle Slice Type | H,L,J,K = rotation | Scroll = move clip plane | Right Click = rotate clip plain | Left Click = rotate camera"


function init(){
    nv = null;
    nv = new Niivue(({show3Dcrosshair: true, backColor: [1, 1, 1, 1]}));
    nv.attachTo("gl");
    nv.setSliceType(nv.sliceTypeMultiplanar);
    nv.setClipPlane([-0.1, 270, 0])
    nv.setClipPlaneColor([0.5, 0.5, 0.5, 0.5])
}

onMounted(() => {
    init();
});

async function loadVolume(volumeLink){
    isLoadingVolume = true;
    await nv.loadVolumes([{ url: volumeLink, colorMap: "gray"}])
    await nv.updateGLVolume();
    if(bundleToLoad){
        let temp = bundleToLoad
        bundleToLoad = null
        loadVolume(temp)
    }
    isLoadingVolume = false;
    if(dataStore.getBundleType == "trk"){
            if(newBundlesToLoad && oldBundlesToLoad){

                updateTrkBundles(newBundlesToLoad,oldBundlesToLoad);
                newBundlesToLoad = null;
                oldBundlesToLoad = null;
            }
    }
    return
}

function changeZoom(){
      nv.scene.volScaleMultiplier = zoom*10;
      nv.drawScene()
}

async function loadTrxFile(url){
    console.log("loading trx")
    if(!nv.initialized) {
        await nv.init();
    }
    if(nv.gl){
        let meshList = [{url, rgba255: [255, 142, 0, 155]}]
        await nv.loadMeshes(meshList)
        return
    }
    return
}

function updateTrxBundles(){
    throw new Error("Not implemented")
}

async function updateTrkBundles(newBundles,oldBundles){
    const removedBundles = oldBundles.filter(item => !newBundles.includes(item))
    const addedBundles = newBundles.filter(item => !oldBundles.includes(item))

    if(removedBundles.length > 0){
        deleteTrkBundles(removedBundles.map(bundle => bundle.url));
    }

    if(addedBundles.length > 0){
        for(let i=0;i<addedBundles.length;i++){
            let bundle = addedBundles[i]
            await loadTrkBundle(bundle.url,bundle.rgba255)
        }
    }
    for(let i=0; i<nv.meshes.length;i++){
                await nv.setMeshProperty(nv.meshes[i].id, "fiberColor","Fixed")
    }

}

function deleteTrkBundles(urls){
    for(let i = 0; i < urls.length; i++){
        nv.removeMeshByUrl(urls[i])
    }
}

async function loadTrkBundle(url,rgba255){
  if (!nv.initialized) {
    await nv.init();
  }

  if (nv.gl) {
    let meshOptions = {url, rgba255, gl: nv.gl}
    await nv.addMeshFromUrl(meshOptions);
    return
  } else {
    console.error('WebGL context is not initialized');
  }
}

async function removeAllBundles(){
    for(let i=0; i<nv.meshes.length;i++){
        await nv.removeMesh(nv.meshes[i].id)
    }
}
var trxLoaded = false;
watch(() => dataStore.getSelectedBundleNames, async (newValue, oldValue) => {
    if(newValue != oldValue && newValue.length > 0){
        if(dataStore.getBundleType == "trx"){
            if(dataStore.getTrxUrl){
                if(trxLoaded == false){
                    await loadTrxFile(dataStore.getTrxUrl)
                    trxLoaded = true;
                }
                await updateTrxBundles(newValue);
            }
        }
    }
});

var newBundlesToLoad = null;
var oldBundlesToLoad = null;

watch(() => dataStore.getTrks, (newBundles,oldBundles) => {
    if(newBundles && dataStore.getBundleType == "trk"){
        if(!isLoadingVolume){
            updateTrkBundles(newBundles,oldBundles)
        }else{
            newBundlesToLoad = newBundles;
            oldBundlesToLoad = oldBundles;
        }
    }
});


watch(() => dataStore.getScanLink, async (newVal) => {
    if(newVal){
        removeAllBundles();
        if(!isLoadingVolume){
            await loadVolume(newVal)
        }else{
            volumeToLoad = newVal;
        }
    }
})

</script>

<style scoped>
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