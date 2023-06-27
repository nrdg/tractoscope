<template>
  <div>TITLE</div>
  <Dataset :dataset="dataset" @datasetChange="initializeDataset" @showOtherComponents="toggleComponents"/>
  <Scan :scanType="scanType" @changedScan="scanChange" :show="show"/>
  <Download :subjectId="subjectId" :dataset="dataset" :scanType="scan"/>
  <Niivue :subjectId="subjectId" :allBundleLinks="allBundleLinks" :bundlesSelected="bundlesSelected" :colors="colors" :dataset="dataset" :scanType="scanType" :bundleTypes="bundleTypes"/>
</template>

<script>

import Niivue from './components/Niivue.vue'
import Download from './components/Download.vue'
import Dataset from './components/Dataset.vue'
import Scan from './components/Scan.vue'

export default {
  name: 'App',

  data(){
    return{
      subjectId:{id: 'sub-NDARAA306NT2', session: 'RU', multipleSessions: false},
      scanType:'b0',
      volumeUrl: "https://fcp-indi.s3.amazonaws.com/data/Projects/HBN/BIDS_curated/derivatives/afq/sub-NDARAA306NT2/ses-HBNsiteRU/sub-NDARAA306NT2_ses-HBNsiteRU_acq-64dir_space-T1w_desc-preproc_dwi_b0.nii.gz",
      allBundleLinks: [],
      bundlesSelected: [],
      colors: [],
      dataset: {name: 'HBN', prefix: 'https://fcp-indi.s3.amazonaws.com/data/Projects/HBN/BIDS_curated'},
      show: true,
      bundleTypes: []
   };
  },
  components: {
    Download,
    Niivue,
    Dataset,
    Scan
  }
}
</script>

<style>
template:{
  background-color: white;
}
</style>