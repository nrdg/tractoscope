<script>
export default {
    props: {
        scans: Array,
    },
    data(){
        return {
            scan: 'model-DKI_FA',
        }
    },
    methods:{
        update(){
            this.$emit("changedScan", this.scan)
        }
    }
}
</script>

<template>
    
        <label>Scan Type: </label>   
        <select v-model="scan" @change="update">
        <option v-for="scan in scans" :value="scan">{{scan}}</option>
        </select>
    
</template>