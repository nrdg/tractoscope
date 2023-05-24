<template>
    <label>Scan Type: </label>   
    <select v-model="scan" @change="update">
      <option v-for="scan in scans" :value="scan">{{scan.name}}</option>
    </select>
</template>

<script>
module.exports= {
  data(){
    return{
      scans:[],
      scan:{},
    }
  },
  methods:{
    update(){
      array = dropVueApp2.arrayBasedOnSubjectAndSite([dropVueApp.subjectId.id, dropVueApp.subjectId.session], dropVueApp2.dataset.prefix, this.scan.url) 
      niivueVueApp.changeVolume(array[0])
      if (checkboxVueApp.bundles.length > 0){
        niivueVueApp.changeMeshes([array, checkboxVueApp.bundles], checkboxVueApp.colorsSelected)
      }
    }
  }
}
</script>
