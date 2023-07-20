<script>
    import Multiselect from '@vueform/multiselect'

    export default {
        props: {
            bundleTypes: Array,

        },
        watch: {
            bundleTypes(newVal) {
                this.initBundles()
            },
            selectedBundles(newVal){
                    this.emitBundles()
            }
        },
        data(){
            return {
                selectedBundles: [],
                bundles: [{label:'select all', options:[]}],
                showBoxes: false,
                toggled: false
            }
        },
        methods: {
            emitBundles(){
                this.colorsSelected = []
                this.$emit("changedMesh", this.selectedBundles)
            },
            initBundles(){
                const len = this.bundleTypes.length
                for(var i = 0; i < len; i++){
                    const bundle = this.bundleTypes[i]
                    const option = {label: bundle.name, value: bundle.id}
                    this.bundles[0].options.push(option)
                }
            }
        },
        components:{
            Multiselect,
        }
    }
</script>

<template>
  <div>
    <Multiselect :searchable="true"
    placeholder="bundles"
    mode='tags'
    :groups="true"
    v-model="selectedBundles"
    :options="bundles"
    />
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>