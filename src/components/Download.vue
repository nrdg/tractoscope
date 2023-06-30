<script>
export default {
    props: {
        volumeUrl: String,
        subjectId: Object,
        scanType: String,
        dataset: Object,
    },
    methods:{
        downloadFile(){
            const fileName = this.subjectId.id+'_'+this.subjectId.session+'_'+this.scanType+'.nii'
            fetch(this.arrayBasedOnSubjectAndSite()[0])
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
        },
        arrayBasedOnSubjectAndSite(){
            const id = this.subjectId.id
            const site = this.subjectId.session
            const newArray = [this.dataset.prefix+"/derivatives/afq/"+id+"/ses-"+this.dataset.name+"site"+site+"/"+id+"_ses-"+this.dataset.name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_"+this.scanType+'.nii.gz']
            return newArray
        },
    }
}
</script>

<template>
    <button @click="downloadFile">Download NIFTI File</button>
</template>