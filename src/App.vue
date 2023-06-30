<template>
  <Dataset @datasetChange="initializeDataset" @showOtherComponents="toggleComponents"/>
  <div v-if="show">
    <Subject :subjects="subjects" @subjectChange="changedSubjectSession"/>
    <Scan @changedScan="scanChange" :scans="scans"/>
    <Bundles @changedMesh="meshChange" :bundleTypes="bundleTypes"/>
  </div>
  <Download :subjectId="subjectId" :dataset="dataset" :scanType="scanType" />
  <Niivue :subjectId="subjectId" :allBundleLinks="allBundleLinks" :bundlesSelected="bundlesSelected" :colors="colors" :dataset="dataset" :scanType="scanType" :bundleTypes="bundleTypes"/>
  <Controls/>
</template>

<script>
import Subject from './components/Subject.vue'
import Niivue from './components/Niivue.vue'
import Download from './components/Download.vue'
import Dataset from './components/Dataset.vue'
import Scan from './components/Scan.vue'
import Bundles from './components/Bundles.vue'
import Controls from './components/Controls.vue'
import * as d3 from 'd3'

export default {
  name: 'App',

  data(){
    return{
      subjectId:{ id: "sub-NDARAA306NT2", session: "RU", multipleSessions: false },
      scanType:'model-DKI_FA',
      allBundleLinks: [],
      bundlesSelected: [],
      colors: [],
      dataset: {name: 'HBN', prefix: 'https://fcp-indi.s3.amazonaws.com/data/Projects/HBN/BIDS_curated'},
      show: true,
      bundleTypes: [],
      subjects: [],
      scans:[],
   };
  },
  methods:{
    scanChange(scan) {
      this.scanType = scan
    },
    async initializeDataset(newDataset){
      this.dataset = newDataset
      console.log("tsvlink: "+this.dataset.prefix+'/derivatives/afq/participants.tsv')
      const array = d3.tsv(newDataset.prefix+'/derivatives/afq/participants.tsv')
      console.log("array b4 async:",array)

      var a = await array
      console.log("array afta async",array)
      console.log("var a:",a)
      var newArray = []
      for (var i = 0; i< a.length; i++){
        for (var j = 0; j<newArray.length; j++){
          if (a[i].participant_id == newArray[j][0]){
            if (typeof newArray[j][1] == "string"){
              var fakearray = [newArray[j][1], a[i].site]
              newArray[j][1] = fakearray
            }
            else{
              newArray[j][q].push(a[i].site)
            }
          }
        }
        newArray.push([a[i].participant_id, a[i].site])
      };
      var classArray = []
      for (i=0; i<newArray.length; i++){
        if (typeof newArray[j][1] == "string"){
          classArray.push({id: newArray[i][0], session: newArray[i][1], multipleSessions: false})
        }
        else{
          classArray.push({id: newArray[i][0], session: newArray[i][1][0], sessions: newArray[i][1], multipleSessions: true})
        }
      }
      this.subjects = classArray
      console.log(this.subjects[10])
      this.subjectId = classArray[0]
      const v = await this.scanCheck()
      this.scanType = this.scans[0]
      console.log("scantype:",this.scanType)
      this.bundleTypes = this.returnBundleTypes()
    },
    toggleComponents(bool){
      this.show = bool
    },
    changedSubjectSession(subjectId){
      this.subjectId = subjectId
      this.scanCheck()
      this.bundleCheck()
      console.log('did it root')
      this.$root.$emit("volumeChange", "it rooted");
    },
    bundleCheck(){
      const id = this.subjectId.id
      const prefix = this.dataset.prefix
      const site = this.subjectId.session
      const newArray = [prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-AntFrontal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ARC_L_tractography.trk",prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ARC_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ATR_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ATR_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CGC_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CGC_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CST_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CST_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-IFO_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-IFO_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ILF_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ILF_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Motor_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Occipital_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Orbital_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-PostParietal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SLF_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SLF_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SupFrontal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SupParietal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Temporal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-UNC_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/clean_bundles/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-UNC_R_tractography.trk"]
      this.allBundleLinks = newArray
    },
    async scanCheck(){
      var array = []
      const scanType = ["model-DKI_FA", 'b0', 'model-CSD_APM', 'model-DKI_AWF',  'model-DKI_MD', 'model-DKI_MK', 'model-DTI_FA']
      for (var i = 0; i<scanType.length; i++){
          const response = await fetch(this.dataset.prefix+"/derivatives/afq/"+this.subjectId.id+"/ses-"+this.dataset.name+"site"+this.subjectId.session+"/"+this.subjectId.id+"_ses-"+this.dataset.name+"site"+this.subjectId.session+"_acq-64dir_space-T1w_desc-preproc_dwi_"+scanType[i]+'.nii.gz')
          if (response.ok){
              array.push(scanType[i])
          }
      }
      this.scans = array
    },
    returnBundleTypes(){
      const bundleTypes = [
              {name: 'Anterior Frontal', id: 0, colorNumber: 0},
              {name: 'Arcuate Fasciculus-Left', id: 1, colorNumber: 18},
              {name: 'Arcuate Fasciculus-Right', id: 2, colorNumber: 19},
              {name: 'Anterior Thalamic Radiation-Left', id: 3, colorNumber: 0},
              {name: 'Anterior Thalamic Radiation-Right', id: 4, colorNumber: 1},
              {name: 'Cingulate Cingulum-Left', id: 5, colorNumber: 4},
              {name: 'Cingulate Cingulum-Right', id: 6, colorNumber: 5},
              {name: 'Corticospinal Tract-Left', id: 7, colorNumber: 2},
              {name: 'Corticospinal Tract-Right', id: 8, colorNumber: 3},
              {name: 'Inferior Fronto-Occipital Fasciculus-Left', id: 9, colorNumber: 10},
              {name: 'Inferior Fronto-Occipital Fasciculus-Right', id: 10, colorNumber: 11},
              {name: 'Inferior Longitudinal Fasciculus-Left', id: 11, colorNumber: 12},
              {name: 'Inferior Longitudinal Fasciculus-Right', id: 12, colorNumber: 13},
              {name: 'Motor', id: 13, colorNumber: 2},
              {name: 'Occipital', id: 14, colorNumber: 4},
              {name: 'Orbital', id: 15, colorNumber: 6},
              {name: 'Posterior Parietal', id: 16, colorNumber: 8},
              {name: 'Superior Longitudinal Fasciculus-Left', id: 17, colorNumber: 14},
              {name: 'Superior Longitudinal Fasciculus-Right', id: 18, colorNumber: 15},
              {name: 'Superior Frontal', id: 19, colorNumber: 10},
              {name: 'Superior Parietal', id: 20, colorNumber: 12},
              {name: 'Temporal', id: 21, colorNumber: 14},
              {name: 'Uncinate Fasciculus-Left', id: 22, colorNumber: 16},
              {name: 'Uncinate Fasciculus-Right', id: 23, colorNumber: 17}
          ]
      return bundleTypes
    },
    meshChange(selectedBundles){
      this.bundlesSelected=selectedBundles
    }
  },
  mounted() {
    this.initializeDataset({name: 'HBN', prefix: 'https://fcp-indi.s3.amazonaws.com/data/Projects/HBN/BIDS_curated'})
    //this.dataset = {name: 'HBN', prefix: 'https://fcp-indi.s3.amazonaws.com/data/Projects/HBN/BIDS_curated'}
    //this.subjectId = { id: "sub-NDARAA306NT2", session: "RU", multipleSessions: false }
    // this.subjects = [{ id: "sub-NDARAA306NT2", session: "RU", multipleSessions: false }, { id: "sub-NDARAA536PTU", session: "SI", multipleSessions: false }]
    // this.scanCheck()
    // //this.scanType = this.scans[0]
    // this.bundleTypes = this.returnBundleTypes()
    // this.bundleCheck()
  },
  components:{
    Download,
    Niivue,
    Dataset,
    Scan,
    Subject,
    Bundles,
    Controls
  }
}
</script>