<template>
  <header>AWS SDK TEST</header>
  <select v-model="dataset">
      <option v-for="(value,key) in datasets" :value="value">{{ key }}</option>
  </select>
  <select v-bind="subject">
      <option v-for="item in subjects" :value="item">{{ item.fileName }}</option>
  </select>

  {{ dataset }}
  </template>


  <script setup>
  import {onMounted, ref, watch, computed} from 'vue'
  import datasets from "../public/datasets.json"
  import {listObjects, listCommonPrefixes, getFileName} from "./utilites/awsHelper.js"

  import SearchableListSelect from "./components/SearchableListSelect.vue"

  const dataset = ref(datasets[Object.keys(datasets)[0]]);
  const subjects = ref([]);
  const subject = ref();

  const params = computed({
      get(){
          let output = {
              Bucket: dataset.value.bucket,
              Prefix: dataset.value.prefix,
              Delimiter: '/'
          }
          return output
      }
  });


  async function updateSubjects(){
      subjects.value = [];
      let prefixes = await listCommonPrefixes(params.value,dataset.value.participantsSize);
      for (let prefix of prefixes){
          let fileName = getFileName(prefix);
          subjects.value.push({prefix,fileName});
      }
  }
  onMounted(async () => {
      updateSubjects();
  });

  watch(dataset, async () => {
      subjects.value = [];
      subjects.value = await listCommonPrefixes(params.value,3000);
  });
  </script>

  <style>

  </style>
