<template>
    <div id='subjectAndSession'>
        <label>Subject: </label>   
        <select v-model="subjectId" @change="update">
          <option v-for="subject in subjects" :value="subject">{{subject.id}}</option>
        </select>
        <label> Session: </label>
        {{subjectId.session}}
    </div>
</template>

<script>
module.exports= {
  data(){
    return{
      subjects:[],
      subjectId:[],
    }
  },
  methods:{
    update(){
      array = dropVueApp2.arrayBasedOnSubjectAndSite([this.subjectId.id, this.subjectId.session], dropVueApp2.dataset.prefix, dropVueApp3.scan.url)
      niivueVueApp.changeVolume(array[0])
      if (checkboxVueApp.bundles.length > 0){
        niivueVueApp.changeMeshes([array, checkboxVueApp.bundles], checkboxVueApp.colorsSelected)
      }
    }
  }
}
</script>
