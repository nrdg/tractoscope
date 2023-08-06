<template>
<Multiselect
    :options="options"
    v-model="subject"
    :value="subject"
    :searchable="true"
    :close-on-select="true"/>
</template>

<style src = "@vueform/multiselect/themes/default.css"></style>

<script setup>
import {watch,ref, computed, onMounted} from 'vue'
import Multiselect from '@vueform/multiselect'

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
watch(() => props.subjectList, () => {
    options.value = getOptions(props.subjectList)
    subject.value = options.value[0].value
})
</script>