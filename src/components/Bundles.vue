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
            selectedBundles(newVal,oldVal){
                if(newVal !== oldVal){
                    this.emitBundles()
                }
            }
        },
        data(){
            return {
                selectedBundles: null,
                bundles: [{label:'select all', options:[]}],
                showBoxes: false,
                toggled: false
            }
        },
        methods: {
            emitBundles(){
                console.log(this.selectedBundles)
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
                console.log(this.bundles[0])
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
    :options="bundles" @change="emitBundles"
    />
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>
<!-- <template>
    <button v-if="!showBoxes" @click="displayBoxes" >Show Bundle Options</button>
    <div v-if="showBoxes">
        <button @click="dontShowBoxes">Don't Show Bundle Options</button>
        <table>
            <br>
            <tr>
                <label><input type="checkbox" v-model = "toggled" @change="toggle">Toggle All</label>
            </tr>
            <tr>
                <td v-for="bundleType in bundleTypes">
                    <label>{{bundleType.name}}</label>
                    <input type="checkbox" v-model="bundles" @change="update" :value="bundleType.id">
                </td>
            </tr>
        </table>
    </div>
</template> -->