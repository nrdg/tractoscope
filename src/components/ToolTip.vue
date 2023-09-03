<template>
    <div class="tooltip"><slot />
        <span class="tooltiptext">{{ props.tip }}</span>
    </div>
</template>

<script setup>
const props = defineProps({tip:{type:String,required:true}})
</script>
<style scoped>

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  width: 400px;
  bottom: 100%;
  left: 200%;
  margin-left: -60px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>