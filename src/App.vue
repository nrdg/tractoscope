<template>
    <div id="app">
        <NiivueRender/>
        <div class="vertical-menu">
            Dataset:
            <select v-model="dataset">
                <option v-for="(value,key) in dataStore.getDatasets" :value="key" :key="key">{{ key }}</option>
            </select>
            Subject:
            <SubjectSelect v-model:subject="subject" :subjects="dataStore.getSubjects"></SubjectSelect>
            <select v-model="scan">
                <option v-for="(item,index) in dataStore.getScans" :value="item" :key="index">{{ item.name }}</option>
            </select>
            <div v-if="dataStore.getSession">session: {{ dataStore.getSession.folderName }}</div>
            <select v-model="session" v-if="dataStore.getSessions.length > 1">
                <option v-for="(item,index) in sessions" :value="item" :key="index">{{ item.folderName }}</option>
            </select>
            <MultiSelect :items="dataStore.getBundleNames" v-model:selected="selectedBundles"/>
            <br>
            Tract Profiles:
            <PngViewer v-if="dataStore.getPngs"/>
        </div>
    </div>
</template>

<script setup>
import {onMounted, computed} from 'vue'
import SubjectSelect from './components/SubjectSelect.vue'
import MultiSelect from './components/MultiSelect.vue'
import NiivueRender from './components/NiivueRender.vue'
import PngViewer from './components/PngViewer.vue'
import { useDataStore } from './utilites/dataStore.js'

const dataStore = useDataStore();

const dataset = computed({
    get() {
        return dataStore.getDatasetKey;
    },
    set(value) {
        return dataStore.setDataset(value);
    }
})
const subject = computed({
    get() {
        return dataStore.getSubject;
    },
    set(value) {
        return dataStore.setSubject(value);
    }
})
const scan = computed({
    get() {
        return dataStore.getScan;
    },
    set(value) {
        return dataStore.setScan(value);
    }
})

const session = computed({
    get() {
        return dataStore.getSession;
    },
    set(value) {
        return dataStore.setSession(value);
    }
})

const selectedBundles = computed({
    get(){
        return dataStore.getSelectedBundleNames;
    },
    set(value){
        return dataStore.selectedBundles = value;
    }
})
onMounted(() => {
    dataStore.setDataset(dataStore.getDatasetKey);
})

</script>

<style>
#app{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: left;
}
#niivue{
  height: 80vh;
  width: 96vw;
  margin: auto;
}
.vertical-menu{
  display: grid;
  justify-content: left;
  align-items: left;
  align-content: start;
  width: 100vw;
  padding: 10px;
}
.vertical-menu > * {
    padding-bottom: 20px;
}

.vertical-menu > *:last-child {
    padding-bottom: 0;
}
.vertical-menu select {
  vertical-align: middle;
  width: 150px;
}

@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

body {
    font-family: 'Roboto', sans-serif;
}
</style>
