<script setup>
import { useDataStore } from '../utilites/dataStore.js'
import { watch, computed,ref } from 'vue';
import { getUrl } from '../utilites/awsHelper.js';

const dataStore = useDataStore();
const selectedPng = ref();
const image = computed({
    get() {
        let params = {
            Bucket: dataStore.getDataset.bucket,
            Key: selectedPng.value,
        }
        return getUrl(params);
    },
})
watch(() => dataStore.getPngs, () => {
    selectedPng.value = null;
});

//returns the last part of a string after the last _ but before the file extension
function filterLastWord(path){
    let lastWord = path.split("-").pop().split(".").shift()
    return lastWord
}
</script>

<template>
    <div class="select-container">
        <select v-model="selectedPng">
            <option v-for="(png, index) in dataStore.getPngs" :value="png" :key="index">{{filterLastWord(png)}}</option>
        </select>
        <button @click="selectedPng = null">Clear</button>
    </div>
    <img class="responsive-image" v-if="selectedPng" :src="image" alt="image from dataset">
</template>

<style>
.select-container {
    display: flex;
    align-items: center;
}
.responsive-image {
    width: 30vw;
    height: 30vh; /* viewport height */
    object-fit: contain; /* resize the image to fit its container while maintaining its aspect ratio */
}
</style>