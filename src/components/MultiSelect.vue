<script setup>
import {computed, defineProps, defineEmits, ref} from 'vue'


const props = defineProps({
    items: {type: Array, required: true},
    selected:{type: Array, required: true}
})

const emit = defineEmits(['update:selected'])


const selected = computed({
    get(){
        return props.selected;
    },
    set(value){
        const newValue = [...selected.value, value];
        emit('update:selected', newValue);
    }
});

const selectValue = ref("select a bundle");

const select = computed({
    get(){
        return selectValue.value;
    },
    set(value){
        const newValue = [...selected.value, value];
        emit('update:selected', newValue);
        console.log("resetting value")
        // Reset the selectValue to the default value
        selectValue.value = "select a bundle";
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
</script>

<template>
    <div id="multiselect">
        <select v-model="select">
            <option selected disabled value="select a bundle">select a bundle</option>
            <option v-for="(item,index) in filteredItems" :value="item" :key="index">{{ item }}</option>
        </select>
        <button @click="toggleAll()">toggle all</button>
        <div id="scrollBox">
            <ul id="remove">
                <li v-for="(item,index) in selected" :key="index"><button @click="removeItem(item)">x</button>{{ item }}</li>
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