<script setup>
import {computed} from 'vue'

props = defineProps({
    items: {type: Array, required: True},
    selected:{type: Array, required: True}
})

emit = defineEmits(['update:selected'])

selected = computed({
    get(){
        return props.selected
    },
    set(value){
        emit('update:selected',value)
    }
})

filteredItems = computed({
    get(){
        var x = props.items
        return x.filter(item => !selected.includes(item));
    }
})

function removeItem(item){
    var x = selected.value.remove(item)
    selected.value = x
}
</script>

<template>
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