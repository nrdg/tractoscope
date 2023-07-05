<script>
export default {
    data(){
        return {
            dataset: {name: 'HBN', prefix: 'https://fcp-indi.s3.amazonaws.com/data/Projects/HBN/BIDS_curated'},
            datasets:[
                {name: 'HBN', prefix: 'https://fcp-indi.s3.amazonaws.com/data/Projects/HBN/BIDS_curated'},
                {name:'Other'}
            ],
            showBoxes: false,
            otherName: '',
            otherPrefix: '',
        }
    },
    methods:{
        update(){
            if (this.dataset.name == 'Other'){
                this.showBoxes = true
                this.$emit("showOtherComponents", false)
            }
            else{
                this.showBoxes = false
                this.$emit("showOtherComponents", true)
                this.$emit("datasetChange", this.dataset)
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
            //this.done = false
            this.update()
        }
    }
}
</script>

<template>
    <label>Choose Dataset: </label>
    <select v-model="dataset" @change="update">
        <option v-for="dataset in datasets" :value="dataset">{{dataset.name}}</option>
    </select>
    <div v-if="showBoxes">
        <label>Type the abbreviation of the dataset you want to use, what comes before '/BIDS_curated':</label>
        <input v-model="otherName"/>
        <br>
        <label>Type the url prefix to the bucket (everything before /derivatives):</label>
        <input v-model="otherPrefix"/>
        <br>
        <button @click="entered">Done</button>
    </div>
</template>