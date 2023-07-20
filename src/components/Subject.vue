<script>
import {timeThursday} from 'd3'
import { ModelSelect} from 'vue-search-select'
export default {
    props: {
        subjects: Array,
    },
    watch: {
        subjects: function(newVal, oldVal) {
            if (newVal !== oldVal || newVal != oldVal){
                this.updateOptions()
            }
        },
        subjectId: function(newVal, oldVal) {
            if (newVal !== oldVal || newVal != oldVal){
                console.log(newVal,oldVal)
                this.emitChange()
            }
        },
    },
    data(){
        return {
            subjectId:{id: 'sub-NDARAA306NT2', session: 'RU', multipleSessions: false},
            options: [],
            item: {
                value: '',
                text: '',
            }
        }
    },
    methods:{
        emitChange(){
            this.$emit("subjectChange", this.subjectId.value)
        },
        updateOptions(){
            for(var i = 0; i < this.subjects.length; i++){
                const subject = this.subjects[i]
                this.options.push({value: subject, text: subject.id})
            }
            console.log(this.options[0],"id")
        },
    },
    components:{
        ModelSelect,
    },
    onMounted(){
        this.updateOptions()
    }
}
</script>

<template>
<model-select :options="options" v-model="subjectId" placeholder="select subject">
</model-select>
</template>

<!-- <template>
    <label>Subject: </label>
    <select v-model="subjectId" @change="update">
        <option v-for="subject in subjects" :value="subject">{{subject.id}}</option>
    </select>
    <label v-if="!subjectId.multipleSessions">Session: {{subjectId.session}}</label>
    <label v-if="subjectId.multipleSessions">Sessions: </label>
    <select v-model="subjectId.session" v-if="subjectId.multipleSessions">
        <option v-for="session in subjectId.sessions">{{session}}</option>
    </select>
</template> -->

