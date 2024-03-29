<template>
    <div id="app">
        <div id="canvas-container">
            <canvas id="gl">Your system doesn't support canvas</canvas>
        </div>
        <div class="bottom-bar">
            <div class="tooltip">
                <ToolTip :tip="tip">Controls</ToolTip>
            </div>
            <div class="zoom">
                    Zoom: <input type="range" min="0.01" max="0.5" step="0.01" v-model="zoom" @input="changeZoom"/>
            </div>
            <div v-if="isLoadingTrx">
                Loading Trx...
            </div>
            <button id="download" @click = "downloadNifti" >Download NIFTI file</button>
            <button id="download" @click = "downloadTrx" v-if="dataStore.getBundleType == 'trx'">Download TRX file</button>
        </div>
    </div>
</template>


<script setup>
import ToolTip from './ToolTip.vue';
import {Niivue} from '@niivue/niivue'
import {onMounted,watch,ref} from 'vue';

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

function downloadTrx(){
    if(dataStore.getTrxUrl){
        window.open(dataStore.getTrxUrl)
    }
}

function downloadNifti(){
    window.open(dataStore.getScanLink)
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
const isLoadingTrx = ref(false);

async function loadTrxFile(url){
    console.log("loading trx")
    isLoadingTrx.value = true;
    if(!nv.initialized) {
        await nv.init();
    }
    if(nv.gl){
        let meshList = [{url, rgba255: [255, 142, 0, 155]}]
        await nv.loadMeshes(meshList)
        isLoadingTrx.value = false;
        console.log("loaded trx")
        return
    }
    return
}

function updateTrxBundles(){
    if(trxLoaded == false){
        return
    }
    let cmap = {
            R: [],
            G: [],
            B: [],
            I: []
    };
    let bundles = dataStore.getTrxBundles;
    for(let i=0;i<bundles.length;i++){
        if(dataStore.getSelectedBundleNames.includes(bundles[i].name)){
            cmap.R.push(bundles[i].rgba255[0])
            cmap.G.push(bundles[i].rgba255[1])
            cmap.B.push(bundles[i].rgba255[2])
            cmap.I.push(bundles[i].index)
        }
    }
    nv.setMeshProperty(nv.meshes[0].id, "fiberGroupColormap", cmap);

}


async function updateTrkBundles(newBundles,oldBundles){
    if(newBundles != null && oldBundles != null){
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
var trxLoading = false;
watch(() => dataStore.getSelectedBundleNames, async (newValue, oldValue) => {
    if(newValue != oldValue){
        if(dataStore.getBundleType == "trx"){
            if(trxLoaded == true){
                updateTrxBundles();
            }
        }
    }
});

var newBundlesToLoad = null;
var oldBundlesToLoad = null;

watch(() => dataStore.getTrks, (newBundles,oldBundles) => {
    if(newBundles && dataStore.getBundleType == "trk"){
        if(trxLoaded == true){
            removeAllBundles();
            trxLoaded = false;
        }
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
        if(!isLoadingVolume){
            await loadVolume(newVal)
            if(dataStore.getBundleType == "trx" && dataStore.getTrxUrl && !trxLoaded && !trxLoading){
                trxLoading = true;
                await loadTrxFile(dataStore.getTrxUrl)
                updateTrxBundles();
                let cmap = {
                    R: [],
                    G: [],
                    B: [],
                    I: []
                }
                nv.setMeshProperty(nv.meshes[0].id, "fiberGroupColormap", cmap)
                trxLoading = false;
                trxLoaded = true;
                dataStore.selectedBundles = dataStore.getBundleNames
            }
        }else{
            volumeToLoad = newVal;
        }
    }
})

watch(() => dataStore.getSubject, async () => {
    await removeAllBundles()
    trxLoaded = false;
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