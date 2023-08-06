<template>
    {{ props.sites }}
<select v-model="site">
    <option v-for="site in sites" :value="site">{{ site }}</option>
</select>
</template>

<script setup>
import {computed} from 'vue'
const props = defineProps({
    sites: {
        type: Array,
        required: true,
        validator: (value) => {
            return value.every(element => typeof element == 'string' )
        },
    },
    site: {} //this prop has no requriments as it is only set by this component, not read
})
const emit = defineEmits(["update:site"])

const site = computed({
    get(){
        return props.site
    },
    set(value){
        emit('update:site',value)
    },
})


</script>