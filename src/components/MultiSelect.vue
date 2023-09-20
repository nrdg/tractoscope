<script setup>
import { computed, defineProps, defineEmits } from 'vue'


const props = defineProps({
    items: {type: Array, required: true},
    selected:{type: Array, required: true}
})

const emit = defineEmits(['update:selected'])

const selected = computed({
    get(){
        return props.selected
    },
    set(value){
        let x = selected.value
        x.push(value)
        emit('update:selected',x)
    }
})

const filteredItems = computed(() => {
    return props.items.filter(item => !props.selected.includes(item))
})



function removeItem(item){
    const updatedSelection = selected.value.filter(selectedItem => selectedItem !== item);
    emit('update:selected',updatedSelection)
}
</script>

<template>
    {{ selected }}
    <div id="multiselect">
        <select v-model="selected">
            <option v-for="item in filteredItems" :value="item">{{ item.name }}</option>
        </select>
        <ul>
            <li v-for="item in selected" @click="removeItem(item)">{{ item.name }}</li>
        </ul>
    </div>
</template>

<style scoped>
#multiselect{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>