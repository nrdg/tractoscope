<script setup>
import whichBucket from '../components/bucket.vue'
import subjectAndSession from '../components/drop.vue'
import scanType from '../components/scan.vue'
import zoom from '../components/zoom.vue'
import checkedboxes from '../components/bundles.vue'
import niivueVue from '../components/niiVued.vue'
</script>

<template>
  <main>
    <whichBucket />
    <subjectAndSession />
    <scanType />
    <zoom />
    <checkedboxes />
    <niivueVue />
  </main>
</template>
