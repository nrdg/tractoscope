<template>
    <div>
      <input v-model="searchQuery" placeholder="Search Subjects..." @input="filterList" />
      <select v-model="selected">
        <option v-for="item in filteredList" :value="item">
          {{ item.id }}
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
        validator: value => {
            return value.every(item => {
                if(typeof(item) == 'Object'){
                    return item.hasOwnAttribute('id')
                }
            })
        }
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
        return props.list.filter(item => item.id.toLowerCase().includes(searchQuery.value.toLowerCase()))
    }
})
</script>