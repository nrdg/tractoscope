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
import {computed} from 'vue'
import Multiselect from '@vueform/multiselect/src/Multiselect';
const emit = defineEmits(['update:selectedBundles'])
const props = defineProps({
    bundles: {
        type: Array,
        required: true,
    },
    selectedBundles: {type:Array,
        required:true
    }
})

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

<style src = "@vueform/multiselect/themes/default.css"></style>