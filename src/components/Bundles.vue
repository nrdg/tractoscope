<script>
export default {
    props: {
        bundleTypes: Array,

    },
    data(){
        return {
            bundles: [],
            showBoxes: false,
            toggled: false
        }
    },
    methods: {
        displayBoxes(){
            this.showBoxes=true
        },
        dontShowBoxes(){
            this.showBoxes=false
        },
        update(){
            this.colorsSelected = []
            if (this.bundles.length < 24){
                this.toggled = false
            }
            this.$emit("changedMesh", this.bundles)
        },
        toggle(){
            this.bundles = []
            if (this.toggled){
                for (var bundleType in this.bundleTypes){
                    this.bundles.push(parseInt(bundleType))
                }
            }
            this.update()
        },
    }
}
</script>

<template>
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
</template>