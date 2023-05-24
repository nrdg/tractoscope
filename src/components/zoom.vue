<template>
    <div id="zoom">
        <label>Zoom: </label>
        <input type="range" min="0.01" max="1" step="0.01" class="slider" v-model="zoom" @change="update"/>
    </div>
</template>

<script>
module.exports= {
  data(){
    return{
      zoom:0.1
    }
  },
  methods:{
    update(){
      niivueVueApp.changeZoom(this.zoom)
    }
  }
}
</script>
