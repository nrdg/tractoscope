<template>
<div id = "app">
  <NiivueRender
  :dataset="dataset"
  :subject="subject"
  :site="site"
  :scan="scan"
  :bundles="selectedBundles"
  />
  <div class = "vertical-menu">
    <DatasetSelect :datasets="datasets" v-model:dataset="dataset" />
    <SubjectSelect :subjectList="subjectList" v-model:subject="subject"/>
    <ListSelect v-if="showSiteSelect" v-model:value="site" :list="sites"/>
    <div v-if="!showSiteSelect">site: {{ sites[0] }}</div>
    <ListSelect v-model:value="scan" :list="scans"/>
    <MultiSelect v-model:selected="selectedBundles" :items="bundles" v-if="bundles.length > 0"/>
  </div>
</div>
</template>

<script setup>
import DatasetSelect from './components/DatasetSelect.vue';
import ListSelect from './components/ListSelect.vue';
import NiivueRender from './components/NiivueRender.vue';
import SubjectSelect from './components/SubjectSelect.vue';
import MultiSelect from './components/MultiSelect.vue';

import { updateSubjectList,getVolumeLink,getBundleLink,checkLink } from './utilites/DatasetLogic';

import datasetConfig from '/public/datasetConfig.json'

import {ref,computed, watch} from 'vue';


const datasets = datasetConfig.datasets
const dataset = ref(datasets[0])
const subjectList = ref([])
const subject = ref(null)
const sites = ref([])
const site = ref(null)
const scans = ref([])
const scan = ref(null)
const bundles = ref([])
const selectedBundles = ref([])

//Maybe this should be inside of SiteSelect component for readability? though that would make it always rendered, which is maybe slower?
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
  var scansToCheck = null
  const output = []
  if(dataset.value.hasOwnProperty('scans')){
    let datasetScans = dataset.value.scans
    let defaultScans = datasetConfig.default.scans
    let x = datasetScans.concat(defaultScans)
    scansToCheck = [...new Set(x)]
  }else{
    console.log("dataset", dataset.value.name," does not contain scans, using defaults")
    scansToCheck = datasetConfig.default.scans
  }

  //this should probably be made into its own function that can be reused, function checkLink
  let x = scansToCheck.map(async (item) => {
    let link = getVolumeLink(dataset.value,subject.value,site.value,item)
    if(await checkLink(link)){
      return item
    }else{
      return false
    }
  })

  let checkedLinks = await Promise.all(x)

  for(let item of checkedLinks){
    if(item){
      output.push(item)
    }
  }
  if(output.length < 1){
    throw new Error("no scans exist for subject",{value:subject.value})
  }
  return output
}

async function updateBundles(){
  var bundlesToCheck = null
  const output = []
  if(dataset.value.hasOwnProperty('bundles')){
    let datasetBundles = dataset.value.bundles
    let defaultBundles = datasetConfig.default.bundles
    let x = datasetBundles.concat(defaultBundles)
    bundlesToCheck = [...new Set(x)]
  }else{
    console.log("dataset",dataset.value.name," does not contain bundles, using defaults")
    bundlesToCheck = datasetConfig.defualt.bundles
  }

  let x = bundlesToCheck.map(async (item) => {
    let link = getBundleLink(dataset.value,subject.value,site.value,item)
    if(await checkLink(link)){
      return item
    }else{
      return false
    }
  })

  let checkedLinks = await Promise.all(x)

  for(let item of checkedLinks){
    if(item){
      output.push(item)
    }
  }
  return output
}
watch(dataset, (newVal) => {
  initalizeSubjectList()
})

watch(subject, async (newVal) => {
  if(newVal){
    updateSite()
    scans.value = []
    let newScans = await updateScans()
    scans.value = newScans
    if(!scans.value.includes(scan.value)){
      scan.value = scans.value[0]
    }

    bundles.value = []
    const newBundles = await updateBundles()
    bundles.value = newBundles
    let previouslySelectedBundles = selectedBundles.value
    selectedBundles.value = []
    previouslySelectedBundles.forEach((element) => {
      if(bundles.value.includes(element)){
        selectedBundles.value.push(element)
      }
    })
  }
})


</script>

<style>
#app{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: left;
}
#niivue{
  height: 80vh;
  width: 96vw;
  margin: auto;
}
.vertical-menu{
  display: grid;
  justify-content: left;
  align-items: left;
  align-content: start;
  width: 100vw;
  padding: 10px;
}
.vertical-menu > * {
    padding-bottom: 20px;
}

.vertical-menu > *:last-child {
    padding-bottom: 0;
}
</style>