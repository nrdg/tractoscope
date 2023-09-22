<template>
<div id="buttons">
<SearchableListSelect v-model:selected="subject" :list="props.subjectList" id="select"/>
<button @click="incrementSubject(-1)">&lt;</button>
<button @click="incrementSubject(1)">&gt;</button>
</div>
</template>

<style>
</style>

<script setup>
import {watch,ref, computed, onMounted} from 'vue'
import SearchableListSelect from './SearchableListSelect.vue';

const props = defineProps({
    subject: {}, //this prop has no requirments as it is only set by this component, not read
    subjectList: {type: Array, required: false,
        validator: (value) => {
                return value.every(element => element.hasOwnProperty('id') && element.hasOwnProperty('site'))
        }
    },
})
const emit = defineEmits(['update:subject','update:subject'])
var options = ref([])
const subject = computed({
    get(){
        return props.subject
    },
    set(value){
        emit('update:subject',value)
    },
})
function getOptions(list){
    if (list.length > 0){
        const options = []
        list.forEach(element => {
            const object = {value: element, label: element.id}
            options.push(object)
        })
        return options
    }else{
        return []
    }
}
function incrementSubject(increment){
    let index = props.subjectList.indexOf(subject.value)
    index += increment
    if(index >= 0 && index < props.subjectList.length){
        let x = props.subjectList[index]
        subject.value = props.subjectList[index]
    }
}
watch(() => props.subjectList, () => {
    options.value = getOptions(props.subjectList)
    subject.value = options.value[0].value
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