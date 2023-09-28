<script setup>
import ToolTip from './ToolTip.vue';
import {NVMesh, Niivue} from '@niivue/niivue'
import {onMounted,ref,watch} from 'vue';
import { checkLink, getVolumeLink, getBundleLink } from '../utilites/DatasetLogic';

const props = defineProps({
    subject: {},
    dataset:{
        type:Object,
        required: true,
        validatior: (value) => {
            return value.hasOwnProperty("name") && value.hasOwnProperty("prefix")
        }
    },
    bundles:{
        type: Array,
        required: false
    },
    scan: {},
    site:{
        type: String,
        required: false,
    }
})

var nv = null
var zoom = 0.1
const tip = "C = Cycle Clip Plane | V = Cycle Slice Type | H,L,J,K = rotation | Scroll = move clip plane | Right Click = rotate clip plain | Left Click = rotate camera"

function loadVolume(volumeLink){
    nv = new Niivue(({show3Dcrosshair: true, backColor: [1, 1, 1, 1]}))
    nv.setSliceType(nv.sliceTypeMultiplanar);
    nv.attachTo('gl')
    nv.setClipPlane([-0.1, 270, 0])
    const volumeList = [
        {url: volumeLink,
        colorMap: "gray",
        }
    ]
    nv.loadVolumes(volumeList)
    nv.updateGLVolume()

}
async function updateVolume(){
    if(props.subject && props.dataset && props.site && props.scan){
        const volumeLink = getVolumeLink(props.dataset,props.subject,props.site,props.scan)
        if (await checkLink(volumeLink)){
            await loadVolume(volumeLink)
            return
        }else{
            throw new Error("link failed check",{value: volumeLink});
        }
    }else{
        return false
    }

}

function deleteBundles(bundles){
    for(let i = 0; i < bundles.length; i++){
        let url = getBundleLink(props.dataset,props.subject,props.site,bundles[i])
        nv.removeMeshByUrl(url)
    }
}
async function loadBundles(bundles){
    const meshes = []
    for(let i = 0; i < bundles.length; i++){
        let bundle = bundles[i]
        let url = getBundleLink(props.dataset,props.subject,props.site,bundle)
        let color = bundle.rgba255
        let x = {url:url, rgba255: color}
        meshes.push(x)
    }
    await nv.loadMeshes(meshes)
    for(let i=0; i<nv.meshes.length;i++){
                await nv.setMeshProperty(nv.meshes[i].id, "fiberColor","Fixed")
    }
}
async function loadBundle(bundle){
  if (!nv.initialized) {
    await nv.init();
  }

  if (nv.gl) {
    let url = getBundleLink(props.dataset,props.subject,props.site,bundle)
    let color = bundle.rgba255
    let meshOptions = {url:url, rgba255: color, gl: nv.gl}
    await nv.addMeshFromUrl(meshOptions);
    return
  } else {
    console.error('WebGL context is not initialized');
  }
}
async function updateBundles(newBundles,oldBundles){
    const removedBundles = oldBundles.filter(item => !newBundles.includes(item))
    const addedBundles = newBundles.filter(item => !oldBundles.includes(item))

    if(removedBundles.length > 0){
        deleteBundles(removedBundles)
    }

    if(addedBundles.length > 0){
        for(let i=0;i<addedBundles.length;i++){
            let bundle = addedBundles[i]
            await loadBundle(bundle)
        }
    }
    for(let i=0; i<nv.meshes.length;i++){
                await nv.setMeshProperty(nv.meshes[i].id, "fiberColor","Fixed")
    }

}

function changeZoom(){
      nv.scene.volScaleMultiplier = zoom*10;
      nv.drawScene()
}
function downloadNifti(){
    const fileName = props.subject.id+'_'+props.site+'_'+props.scan+'.nii.gz'
    const volumeLink = getVolumeLink(props.dataset,props.subject,props.site,props.scan)
    if (checkLink(volumeLink)){
        fetch(volumeLink)
        .then(res => res.blob())
        .then(res => {
            const aElement = document.createElement('a');
            aElement.setAttribute('download', fileName);
            const href = URL.createObjectURL(res);
            aElement.href = href;
            aElement.setAttribute('target', '_blank');
            aElement.click();
            URL.revokeObjectURL(href);
    });
    }else{
        throw new Error("volumeLink failed check, likely does not exist",{value: volumeLink})
    }
}

//must be cleaner way to watch multiple objects?
watch(() => props.subject, async () => {
    await updateVolume()
    if(props.bundles.length > 0){
        await loadBundles(props.bundles)
    }
})
watch(() => props.scan, () => {
    updateVolume()
})
watch(() => props.dataset, () => {
    updateVolume()
})
watch(() => props.site, () => {
    updateVolume()
})
watch(() => props.bundles, (newVal,oldVal) => {
    if(nv){
        updateBundles(newVal,oldVal)
    }
})
</script>

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