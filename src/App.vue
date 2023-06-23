<template>
  <div>TITLE</div>
  <Niivue :volumeUrl="volumeUrl"/>
</template>

<script>

import Niivue from './components/Niivue.vue'

export default {
  name: 'App',

  data(){
    return{
      volumeUrl: "https://fcp-indi.s3.amazonaws.com/data/Projects/HBN/BIDS_curated/derivatives/afq/sub-NDARAA306NT2/ses-HBNsiteRU/sub-NDARAA306NT2_ses-HBNsiteRU_acq-64dir_space-T1w_desc-preproc_dwi_b0.nii.gz"
    };
  },
  components: {
    Niivue
  }
}
</script>
