<template>
    <div id ='checkedboxes'>
        <label>Bundles To Include: </label>
        <br>
        <label><input type="checkbox" v-model = "toggled" @change="toggle">Toggle All</label>
        <table>
          <td v-for="bundleType in bundleTypes">
            <label>{{bundleType.name}}</label>
            <input type="checkbox" v-model="bundles" @change="update" :value="bundleType.id">
          </td>
        </table>
      </div>
</template>

<script>
module.exports= {
  data(){
    return{
      bundleTypes:this.returnBundleTypes(),
      bundles:[],
      toggled:false,
      colors:this.returnColorArray(),
      colorsSelected:[]
    }
  },
  methods:{
    update(){
      this.colorsSelected = []
      for (j = 0; j < (this.bundles.length); j++){
        this.colorsSelected.push(this.colors[this.bundleTypes[this.bundles[j]].colorNumber])
      }
      niivueVueApp.changeMeshes([dropVueApp2.arrayBasedOnSubjectAndSite([dropVueApp.subjectId.id, dropVueApp.subjectId.session], dropVueApp2.dataset.prefix, dropVueApp3.scan.url), this.bundles], this.colorsSelected)
      if (this.bundles.length < 24){
        this.toggled = false
      }
    },
    toggle(){
      this.bundles = []
      if (this.toggled){
        for (bundleType in this.bundleTypes){
          this.bundles.push(bundleType)
        }
      }
    this.update()
    },
    returnColorArray(){
      tableau_20 = [
          [0.12156862745098039, 0.4666666666666667, 0.7058823529411765],
          [0.6823529411764706, 0.7803921568627451, 0.9098039215686274],
          [1.0, 0.4980392156862745, 0.054901960784313725],
          [1.0, 0.7333333333333333, 0.47058823529411764],
          [0.17254901960784313, 0.6274509803921569, 0.17254901960784313],
          [0.596078431372549, 0.8745098039215686, 0.5411764705882353],
          [0.8392156862745098, 0.15294117647058825, 0.1568627450980392],
          [1.0, 0.596078431372549, 0.5882352941176471],
          [0.5803921568627451, 0.403921568627451, 0.7411764705882353],
          [0.7725490196078432, 0.6901960784313725, 0.8352941176470589],
          [0.5490196078431373, 0.33725490196078434, 0.29411764705882354],
          [0.7686274509803922, 0.611764705882353, 0.5803921568627451],
          [0.8901960784313725, 0.4666666666666667, 0.7607843137254902],
          [0.9686274509803922, 0.7137254901960784, 0.8235294117647058],
          [0.4980392156862745, 0.4980392156862745, 0.4980392156862745],
          [0.7803921568627451, 0.7803921568627451, 0.7803921568627451],
          [0.7372549019607844, 0.7411764705882353, 0.13333333333333333],
          [0.8588235294117647, 0.8588235294117647, 0.5529411764705883],
          [0.09019607843137255, 0.7450980392156863, 0.8117647058823529],
          [0.6196078431372549, 0.8549019607843137, 0.8980392156862745]]
      rgbarray = []
      for (i = 0; i<tableau_20.length; i++){
          array = []
          for (j = 0; j<3; j++){
              array.push(tableau_20[i][j]*255)
          }
          array.push(255)
          rgbarray.push(array)
      }
      return rgbarray
    },
    returnBundleTypes(){
      bundleTypes = [
              {name: 'Anterior Frontal', id: 0, colorNumber: 0},
              {name: 'Arcuate Fasciculus-Left', id: 1, colorNumber: 18},
              {name: 'Arcuate Fasciculus-Right', id: 2, colorNumber: 19},
              {name: 'Anterior Thalamic Radiation-Left', id: 3, colorNumber: 0},
              {name: 'Anterior Thalamic Radiation-Right', id: 4, colorNumber: 1},
              {name: 'Cingulate Cingulum-Left', id: 5, colorNumber: 4},
              {name: 'Cingulate Cingulum-Right', id: 6, colorNumber: 5},
              {name: 'Corticospinal Tract-Left', id: 7, colorNumber: 2},
              {name: 'Corticospinal Tract-Right', id: 8, colorNumber: 3},
              {name: 'Inferior Fronto-Occipital Fasciculus-Left', id: 9, colorNumber: 10},
              {name: 'Inferior Fronto-Occipital Fasciculus-Right', id: 10, colorNumber: 11},
              {name: 'Inferior Longitudinal Fasciculus-Left', id: 11, colorNumber: 12},
              {name: 'Inferior Longitudinal Fasciculus-Right', id: 12, colorNumber: 13},
              {name: 'Motor', id: 13, colorNumber: 2},
              {name: 'Occipital', id: 14, colorNumber: 4},
              {name: 'Orbital', id: 15, colorNumber: 6},
              {name: 'Posterior Parietal', id: 16, colorNumber: 8},
              {name: 'Superior Longitudinal Fasciculus-Left', id: 17, colorNumber: 14},
              {name: 'Superior Longitudinal Fasciculus-Right', id: 18, colorNumber: 15},
              {name: 'Superior Frontal', id: 19, colorNumber: 10},
              {name: 'Superior Parietal', id: 20, colorNumber: 12},
              {name: 'Temporal', id: 21, colorNumber: 14},
              {name: 'Uncinate Fasciculus-Left', id: 22, colorNumber: 16},
              {name: 'Uncinate Fasciculus-Right', id: 23, colorNumber: 17}
          ]
      return bundleTypes
    }
  }
}
</script>
