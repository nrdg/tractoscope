<template>
<div id="buttons">
<SearchableListSelect v-model:selected="subject" :list="subjects" id="select"/>
<button @click="incrementSubject(-1)">&lt;</button>
<button @click="incrementSubject(1)">&gt;</button>
</div>
</template>

<script setup>
import SearchableListSelect from './SearchableListSelect.vue';
import {computed} from 'vue'

const props = defineProps({
    subject: {}, //this prop has no requirments as it is only set by this component, not read
    subjects: {type: Array, required: true}
})

const emit = defineEmits(['update:subject'])

function incrementSubject(increment){
    if(props.subject){
        let index = props.subjects.indexOf(props.subject)
        index += increment
        if(index >= 0 && index < props.subjects.length){
            subject.value = props.subjects[index]
        }
    }
}
const subject = computed({
    get(){
        return props.subject
    },
    set(value){
        emit('update:subject',value)
    },
})


</script>


<style scoped>
.buttons{
    padding-left: 0px;
    padding-right: 0px;
}
.select{
    padding-left: 0px;
    padding-right: 0px;
}
</style>