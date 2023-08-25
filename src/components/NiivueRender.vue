<script setup>
import {Niivue} from '@niivue/niivue'
import {onMounted,ref,watch} from 'vue';
import { checkLink, getVolumeLink, getBundleLink } from '../utilites/DatasetLogic';

const props = defineProps({
    // subject: {type: Object, required: true,
    //     validator: (value) => {
    //         return value.hasOwnProperty('id') && value.hasOwnProperty('site')
    //     }
    // },
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
    // scan:{
    //     type: String,
    //     required: true,
    //     validator: (value) => {
    //         return value.every(element => element.hasOwnProperty('fileName'))
    //     }
    // },
    site:{
        type: String,
        required: false,
    }
})

var nv = null
var zoom = 0.1

function loadVolume(volumeLink){
    nv = new Niivue(({show3Dcrosshair: true, backColor: [1, 1, 1, 1]}))
    nv.setSliceType(nv.sliceTypeRender)
    nv.attachTo('gl')
    nv.setClipPlane([-0.1, 270, 0])
    const volumeList = [
        {url: volumeLink,
        colorMap: "gray"
        }
    ]
    nv.loadVolumes(volumeList)
    nv.updateGLVolume()

}
async function updateVolume(){
    if(props.subject && props.dataset && props.site && props.scan){
        const volumeLink = getVolumeLink(props.dataset,props.subject,props.site,props.scan)
        if (await checkLink(volumeLink)){
            loadVolume(volumeLink)
        }else{
            throw new Error("link failed check",{value: volumeLink});
        }
    }else{
        return false
    }

}
async function loadBundles(){
    const bundleUrls = []
    props.bundles.forEach((element) => {
        let url = getBundleLink(props.dataset,props.subject,props.site,element)
        let color = element.rgba255
        let x = {url:url, rgba255: color}
        bundleUrls.push(x)
    })
    await nv.loadMeshes(bundleUrls)
    for(let i = 0; i<bundleUrls.length; i++){
        await nv.setMeshProperty(nv.meshes[i].id, "fiberColor","Fixed")
    }
}
function changeZoom(){
      nv.scene.volScaleMultiplier = zoom*10;
      nv.drawScene()
}
function downloadNifti(){
    console.log(props.subject)
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
watch(() => props.subject, () => {
    updateVolume()
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
watch(() => props.bundles, () => {
    if(nv){
        loadBundles()
    }
})
</script>

<template>
    <canvas id="gl"></canvas>
    <div>C = Cycle Clip Plane | V = Cycle Slice Type | H,L,J,K = rotation | Scroll = move clip plane | Right Click = rotate clip plain | Left Click = rotate camera | Zoom:
        <input type="range" min="0.01" max="0.5" step="0.01" class="slider" v-model="zoom" @input="changeZoom"/>
        <button id="download" @click = "downloadNifti" >Download NIFTI file</button> </div>
</template>

<style scoped>
#download{
    float: right;
}
#gl{
    border: 1px solid black;
}
</style>