<script>
export default {
    name: "subject",
    emits: ["subjectChange"],
    props: {
        subjects: Array,
    },
    data(){
        return {
            subjectId:{id: 'sub-NDARAA306NT2', session: 'RU', multipleSessions: false},
            options:[]
        }
    },
    methods:{
        update(){
            this.$emit("subjectChange", this.subjectId)
        },
        initOptions(){
            for(subject in this.subjects){
                this.options.push({value: subject, text: subject.id})
            }
        }
    },
}
</script>

<template>
    <label>Subject: </label>
    <select v-model="subjectId" @change="update">
        <option v-for="subject in subjects" :value="subject">{{subject.id}}</option>
    </select>
    <label v-if="!subjectId.multipleSessions">Session: {{subjectId.session}}</label>
    <label v-if="subjectId.multipleSessions">Sessions: </label>
    <select v-model="subjectId.session" v-if="subjectId.multipleSessions">
        <option v-for="session in subjectId.sessions">{{session}}</option>
    </select>
</template>
