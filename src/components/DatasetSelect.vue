<template>
<div>
Dataset:
<select v-model="selectedDataset">
    <option v-for="dataset in props.datasets" :key="dataset.id" :value="dataset">{{ dataset.name }}</option>
</select>
</div>
</template>

<script setup>
import {computed, onMounted} from 'vue'

const props = defineProps({
    datasets:{
        type: Array,
        required: true,
        validator: (value) => {
            return value.every(element => element.hasOwnProperty('name') && element.hasOwnProperty('prefix'));
        }
    },
    dataset:{required: true,}
})
const emit = defineEmits(['update:dataset'])

const selectedDataset = computed({
    get(){
        return props.dataset
    },
    set(value){
        emit('update:dataset',value)
    },
})

</script>