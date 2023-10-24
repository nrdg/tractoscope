<template>
    <div class = "search-select">
      <input v-model="searchQuery" placeholder="Search Subjects..." @input="filterList" />
      <select v-model="selected">
        <option v-for="item in filteredList" :value="item">
          {{ item.folderName }}
        </option>
      </select>
    </div>
  </template>

<script setup>
import {ref, computed} from 'vue'
const emit = defineEmits(['update:selected'])
const props = defineProps({
    list: {
        type: Array,
        required: true,
    },
    selected: {
        type: [String, Object],
        default: ""
    }})

const searchQuery = ref("")
const selected = computed({
    get(){
        return props.selected
    },
    set(value){
        emit('update:selected',value)
    }
})
const filteredList = computed({
    get(){
        return props.list.filter(item => item.folderName.toLowerCase().includes(searchQuery.value.toLowerCase()))
    }
})
</script>

<style scoped>
.search-select {
    display: flex;
    flex-direction: column;
    gap: 0px;
    width: 200px;
}
</style>