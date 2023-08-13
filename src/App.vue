<template>
<DatasetSelect :datasets="datasets" v-model:dataset="dataset" />
<SubjectSelect :subjectList="subjectList" v-model:subject="subject"/>
<ListSelect v-if="showSiteSelect" v-model:value="site" :list="sites"/>
<ListSelect v-model:value="scan" :list="scans"/>
<BundleSelect v-model:selectedBundles="selectedBundles" :bundles="bundles"/>
<div id="vars">
  <!-- <ul>
    <li>dataset = {{ dataset?.name }}</li>
    <li>subject = {{ subject }}</li>
    <li>sites = {{ sites }}</li>
    <li>site = {{ site }}</li>
    <li>scans = {{ scans }}</li>
    <li>scan = {{ scan }}</li>
    <li>bundles = {{ bundles }}</li>
    <li>selectedBundles = {{ selectedBundles }}</li>
  </ul> -->
  <div id="niivue">
    <NiivueRender
    :dataset="dataset"
    :subject="subject"
    :site="site"
    :scan="scan"
    :bundles="selectedBundles"
    />
  </div>
</div>
</template>

<script setup>
import SubjectSelect from './components/SubjectSelect.vue';
import DatasetSelect from './components/DatasetSelect.vue';
import ListSelect from './components/ListSelect.vue';
import NiivueRender from './components/NiivueRender.vue';

import { updateSubjectList,getVolumeLink,getBundleLink,checkLink } from './utilites/DatasetLogic';

import datasetConfig from '/public/datasetConfig.json'

import {ref,computed, watch} from 'vue';
import BundleSelect from './components/BundleSelect.vue';


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

  // for (let element of scansToCheck){
  //   let link = getVolumeLink(dataset.value,subject.value,site.value,element)
  //   let doesLinkExist = await checkLink(link)
  //   if(doesLinkExist){
  //     output.push(element)
  //   }
  // }

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
  return output

  // if(output.length < 1){
  //   throw new Error("no scans exist for subject",{value:subject.value})
  // }
  // return output
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
#niivue{
  height: 80vh;
  width: 96vw;
  margin: auto;
}
</style>