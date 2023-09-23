<script setup>
import { computed, defineProps, defineEmits, watch } from 'vue'


const props = defineProps({
    items: {type: Array, required: true},
    selected:{type: Array, required: true}
})

const emit = defineEmits(['update:selected'])

// const selected = computed({
//     get(){
//         return props.selected
//     },
//     set(value){
//         let x = selected.value
//         x.push(value)
//         emit('update:selected',x)
//     }
// })

const selected = computed({
    get(){
        return props.selected;
    },
    set(value){
        const newValue = [...selected.value, value];
        emit('update:selected', newValue);
    }
});

const filteredItems = computed(() => {
    return props.items.filter(item => !props.selected.includes(item))
})



function removeItem(item){
    const updatedSelection = selected.value.filter(selectedItem => selectedItem !== item);
    emit('update:selected',updatedSelection)
}
function toggleAll(){
   if(selected.value.length > 0){
        emit('update:selected',[])
    }else{
        emit('update:selected',props.items)
    }
}

watch(() => selected.value, (newVal,oldVal) => {
    console.log("selected changed")
})
</script>

<template>
    <div id="multiselect">
        <select v-model="selected">
            <option v-for="item in filteredItems" :value="item">{{ item.name }}</option>
        </select>
        <button @click="toggleAll()">toggle all</button>
        <div id="scrollBox">
            <ul id="remove">
                <li v-for="item in selected"><button @click="removeItem(item)">x</button>{{ item.name }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
#multiselect{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#scrollBox {
  border: none;
  padding: 5px;
  width: 200px;
  max-height: 200px;
  overflow: auto;
}
ul#remove {
    list-style-type: none;
    padding: 0;
}
</style>