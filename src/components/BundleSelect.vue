<template>
    <Multiselect :searchable="true"
    placeholder="select bundles"
    mode='tags'
    :groups="true"
    v-model="selectedBundles"
    :options="options"
    />
</template>

<script setup>
import {computed,ref, watch} from 'vue'
import Multiselect from '@vueform/multiselect/src/Multiselect';
const emit = defineEmits(['update:selectedBundles'])
const props = defineProps({
    bundles: {
        type: Array,
        required: true,
        // validator: (value) => {         // validator not currently working
        //     value.every(element => {
        //         console.log(element.name)
        //         return element.hasOwnProperty('name')
        //     })
        // }
    },
    selectedBundles: {type:Array,
        required:true
    }
})

const multiSelectOptions = ref([{label:'select all',options:[]}])

const selectedBundles = computed({
    get(){
        return props.selectedBundles
    },
    set(value){
        emit('update:selectedBundles',value)
    }
})

const options = computed({
    get(){
        const x = []
        props.bundles.forEach((element => {
            const option = {label: element.name, value: element}
            x.push(option)
        }))
        return [{label:'select all',options:x}]
    }
})
</script>