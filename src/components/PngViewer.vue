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
        return getUrl(params);
    },
})
watch(() => dataStore.getPngs, (newValue, oldValue) => {
    selectedPng.value = null;
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
    width: 30vw;
    height: 30vh; /* viewport height */
    object-fit: contain; /* resize the image to fit its container while maintaining its aspect ratio */
}
</style>