<script>
export default {
    props: {
        subjects: Array,
    },
    data(){
        return {
            subjectId:{id: 'sub-NDARAA306NT2', session: 'RU', multipleSessions: false},
        }
    },
    methods:{
        update(){
            this.$emit("subjectChange", this.subjectId)
        }
    }
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