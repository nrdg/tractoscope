<script>
export default {
    props: {
        volumeUrl: String,
        subjectId: Object,
        scanType: String
    },
    methods:{
        downloadFile(){
            const fileName = this.subjectId.id+'_'+this.subjectId.session+'_'+this.scanType+'.nii'
            fetch(this.volumeUrl)
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
        }
    }
}
</script>

<template>
    <button @click="downloadFile">Download NIFTI File</button>
</template>