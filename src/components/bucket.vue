<template>
    <div id='whichBucket'>
        <label>Choose Dataset: </label>
        <select v-model="dataset" @change="update">
          <option v-for="dataset in datasets" :value="dataset">{{dataset.name}}</option>
        </select>
        <input v-if="showBoxes" v-model="otherName" placeholder="Type the name of the dataset you want to use." />
        <input v-if="showBoxes" v-model="otherPrefix" placeholder="Type the url prefix to the bucket. This is everything before /derivatives."/>
        <input type="checkbox" v-if="showBoxes"v-model="done" @click="entered"/>
        <label v-if="showBoxes">Done</label>
      </div>
</template>

<script>
module.exports= {
  data(){
    return{
      datasets:[
        {name: 'Healthy Brain Network', prefix: 'https://fcp-indi.s3.amazonaws.com/data/Projects/HBN/BIDS_curated'},
        {name:'Other'}
      ],
      dataset:{name: 'Healthy Brain Network', prefix: 'https://fcp-indi.s3.amazonaws.com/data/Projects/HBN/BIDS_curated'},
      showBoxes: false,
      otherName: '',
      otherPrefix: '',
      done: false
    }
  },
  methods:{
    update(){
      if (this.dataset.name == 'Other'){
        this.showBoxes = true
      }
      else{
        this.showBoxes = false
        this.initializeDataset()
      }
    },
    entered(){
      this.datasets.pop()
      this.datasets.push({name:this.otherName, prefix: this.otherPrefix})
      this.dataset = {name:this.otherName, prefix: this.otherPrefix}
      this.datasets.push({name:'Other'})
      this.showBoxes = false
      this.otherName = ''
      this.otherPrefix = ''
      this.done = false
      this.update()
    },
    initializeSite(){
      array = d3.tsv(this.dataset.prefix+'/derivatives/afq/participants.tsv')
      const makeRealArray = async () => {
          const a = await array
          newArray = []
          for (i = 0; i< a.length; i++){
              newArray.push([a[i].participant_id, a[i].site])
          };
          classArray = []
          for (i=0; i<newArray.length; i++){
              classArray.push({id: newArray[i][0], session: newArray[i][1]})
          }
          dropVueApp.subjects = classArray
          dropVueApp.subjectId = classArray[0]
          dropVueApp3.scans = await this.findAllScans()
          dropVueApp3.scan = dropVueApp3.scans[0]
          niivueVueApp.initializeVolumeList([this.arrayBasedOnSubjectAndSite(newArray[0], this.dataset.prefix, dropVueApp3.scan.url), checkboxVueApp.bundles], checkboxVueApp.colorsSelected)
      };
      makeRealArray()
    },
    initializeDataset(){
      array = d3.tsv(this.dataset.prefix+'/derivatives/afq/participants.tsv')
      const makeRealArray = async () => {
          const a = await array
          newArray = []
          for (i = 0; i< a.length; i++){
              newArray.push([a[i].participant_id, a[i].site])
          };
          classArray = []
          for (i=0; i<newArray.length; i++){
              classArray.push({id: newArray[i][0], session: newArray[i][1]})
          }
          dropVueApp.subjects = classArray
          dropVueApp.subjectId = classArray[0]
          dropVueApp3.scans = await this.findAllScans()
          dropVueApp3.scan = dropVueApp3.scans[0]
          array = this.arrayBasedOnSubjectAndSite(newArray[0], this.dataset.prefix, dropVueApp3.scan.url)
          niivueVueApp.changeVolume(array[0])
          if (checkboxVueApp.bundles.length > 0){
            niivueVueApp.changeMeshes([array, checkboxVueApp.bundles], checkboxVueApp.colorsSelected)
          }
      };
      makeRealArray()
    },
    arrayBasedOnSubjectAndSite(array, prefix, postFix){
      id = array[0]
      site = array[1]
      newArray = [prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_"+postFix+'.nii.gz',[prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-AntFrontal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ARC_L_tractography.trk",prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ARC_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ATR_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ATR_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CGC_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CGC_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CST_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CST_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-IFO_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-IFO_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ILF_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ILF_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Motor_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Occipital_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Orbital_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-PostParietal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SLF_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SLF_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SupFrontal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SupParietal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Temporal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-UNC_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-UNC_R_tractography.trk"]]
      return newArray
    },
    async findAllScans(){
      array = [{url: "model-DKI_FA", name: 'T1W'}]
      scanType = ['b0', 'brain_mask', 'mapping_from-DWI_to_MNI_xfm', 'model-CSD_APM', 'model-CSD_diffmodel', 'model-DKI_AWF', 'model-DKI_diffmodel', 'model-DKI_MD', 'model-DKI_MK', 'model-DTI_diffmodel', 'model-DTI_FA', 'seed_mask', 'stop_mask']
      for (i = 0; i<scanType.length; i++){
          response = await fetch(this.dataset.prefix+"/derivatives/afq/"+dropVueApp.subjectId.id+"/ses-HBNsite"+dropVueApp.subjectId.session+"/"+dropVueApp.subjectId.id+"_ses-HBNsite"+dropVueApp.subjectId.session+"_acq-64dir_space-T1w_desc-preproc_dwi_"+scanType[i]+'.nii.gz')
          if (response.ok){
              array.push({url: scanType[i], name: scanType[i]})
          }
      }
      return array
    }
  }
}
</script>
