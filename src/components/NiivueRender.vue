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
</template>

<style scoped>
#zoom{
  background-color: white;
  display: "block";
}
</style>