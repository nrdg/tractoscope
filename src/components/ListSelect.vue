<template>
<select v-model="value">
    <option v-for="element in list" :value="element">{{ element }}</option>
</select>
</template>

<script setup>
import {computed} from 'vue'
const props = defineProps({
    list: {
        type: Array,
        required: true,
        validator: (value) => {
            return value.every(element => typeof element == 'string' )
        },
    },
    value: {required:true} //this prop has no requriments as it is only set by this component, not read
})
const emit = defineEmits(["update:value"])

const value = computed({
    get(){
        return props.value
    },
    set(value){
        emit('update:value',value)
    },
})


</script>