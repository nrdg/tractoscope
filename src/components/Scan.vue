<script>
export default {
    props: {
        scans: Array,
        show: Boolean
    },
    data(){
        return {
            scan: '',
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
    <div v-if="show">
          <label>Scan Type: </label>   
          <select v-model="scan" @change="update">
            <option v-for="scan in scans" :value="scan">{{scan}}</option>
          </select>
    </div>
</template>