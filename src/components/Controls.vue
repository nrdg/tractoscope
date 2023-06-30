<template>
    <button @click="toggleControls">{{ content }}</button>
    <div v-if="controlsDisplayed">
        <br>
        <label>Controls: </label>
        <ul>
        <li>Scroll to move the clip plane along the default axis. </li>
        <li>Left Click and move the mouse to rotate the camera.</li>
        <li>Right Click and move the mouse to rotate the clip plane.</li>
        <li>Click C to cycle through the default clip plane options.</li>
        <li>Click V to cycle through the default slice type options.</li>
        <li>Pressing H or L rotates the scene in opposite directions about the vertical axis.</li>
        <li>Pressing J or K rotates the scene in opposite directions about one of the horizontal axes.</li>
        </ul>
    </div>
</template>

<script>
export default{
    data(){
        return{
            controlsDisplayed: false,
            content: "Show Controls"
        }
    },
    methods:{
        toggleControls(){
            if (this.controlsDisplayed==true) {
                this.controlsDisplayed=false
                this.content="Show Controls"
            }else if (this.controlsDisplayed==false){
                this.controlsDisplayed=true
                this.content="Hide Controls"
            }
        }
    }
}
</script>