<script setup>
import { useDataStore } from '../utilites/dataStore.js'
import { watch, computed,ref } from 'vue';
import { getUrl } from '../utilites/awsHelper.js';
import { getLastPathComponent } from '../utilites/logic';

const dataStore = useDataStore();
const selectedPng = ref();
const image = computed({
    get() {
        let params = {
            Bucket: dataStore.getDataset.bucket,
            Key: selectedPng.value,
        }
        console.log(params);
        let x = getUrl(params);
        console.log(x)
        return x;
    },
})
watch(() => dataStore.getPngs, (newValue, oldValue) => {
});
watch(selectedPng, (newValue, oldValue) => {
    console.log(newValue)
});
</script>

<template>
    <div class="select-container">
        <select v-model="selectedPng">
            <option v-for="png in dataStore.getPngs" :value="png">{{getLastPathComponent(png)}}</option>
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
    width: 100%;
    height: 40vh; /* viewport height */
    object-fit: contain; /* resize the image to fit its container while maintaining its aspect ratio */
}
</style>