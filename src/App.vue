<template>
<DatasetSelect :datasets="datasets" v-model:dataset="dataset" />
<SubjectSelect :subjectList="subjectList" v-model:subject="subject"/>
<ListSelect v-if="showSiteSelect" v-model:value="site" :list="sites"/>
<ListSelect v-model:value="scan" :list="scans"/>
<div id="vars">
  <ul>
    <li>dataset = {{ dataset?.name }}</li>
    <li>subject = {{ subject }}</li>
    <li>sites = {{ sites }}</li>
    <li>site = {{ site }}</li>
    <li>scans = {{ scans }}</li>
    <li>scan = {{ scan }}</li>
  </ul>
</div>
</template>

<script setup>
import SubjectSelect from './components/SubjectSelect.vue';
import DatasetSelect from './components/DatasetSelect.vue';
import ListSelect from './components/ListSelect.vue';

import { updateSubjectList,getVolumeLink,checkLink } from './utilites/DatasetLogic';

import datasetConfig from '/public/datasetConfig.json'

import {ref,computed,onMounted, watch,toRaw} from 'vue';


const datasets = datasetConfig.datasets
const dataset = ref(datasets[0])
const subjectList = ref([])
const subject = ref(null)
const sites = ref([])
const site = ref(null)
const scans = ref([])
const scan = ref(null)
const test = ref(["test","test2"])

//this is a little messy but it handles all edge cases without erroring.
//Maybe this should be inside of SiteSelect component for readability? though that would make it always rendered, whichmaybe slower?
const showSiteSelect = computed({
  get(){
    if(sites.value.length > 1){
      return true
    }else{
      return false
    }
  }
})

initalizeSubjectList()
async function initalizeSubjectList(){
  try{
    subjectList.value = await updateSubjectList(dataset.value)
  }catch(e){
    console.log("updateSubjectList error",e.message)
  }
  subject.value = subjectList.value[0]
}
function updateSite(){
  if(typeof subject.value.site === 'string'){
    site.value = subject.value.site
    sites.value = [subject.value.site]
  }else{
    site.value = subject.value.site[0]
    sites.value = subject.value.site
  }
}
async function updateScans(){
  scans.value = []
  var scansToCheck = null
  if(dataset.value.hasOwnProperty('scans')){
    let datasetScans = dataset.value.scans
    let defaultScans = datasetConfig.default.scans
    let x = datasetScans.concat(defaultScans)
    scansToCheck = [...new Set(x)]
  }else{
    console.log("dataset", dataset.value.name," does not contain scans, using defaults")
    scansToCheck = datasetConfig.default.scans
  }

  for (let element of scansToCheck){
    let link = getVolumeLink(dataset.value,subject.value,site.value,element)
    let doesLinkExist = await checkLink(link)
    if(doesLinkExist){
      scans.value.push(element)
    }else{
      console.log("doesnt exist",element)
    }
  }
  if(scans.value.length < 1){
    throw new Error("no scans exist for subject",{value:subject.value})
  }
}
watch(subject, async () => {
  updateSite()
  await updateScans()
  scan.value = scans.value[0]
})
</script>