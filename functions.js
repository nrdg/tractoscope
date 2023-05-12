function changeVolumeList(subjectData) {
    var volumeList1 = [
	// first item is background image
	 {
	   url: subjectData[0][0],//"./images/RAS.nii.gz", "./images/spm152.nii.gz",

     //url: "httpes://fcp-indi.s3.amazonaws.com/data/Projects/HBN/BIDS_curated/derivatives/afq/sub-NDARAA947ZG5/ses-HBNsiteCBIC/sub-NDARAA947ZG5_ses-HBNsiteCBIC_acq-64dir_space-T1w_desc-preproc_dwi_model-DKI_AWF.nii.gz",
     colorMap: "gray",
	   opacity: 1,
	   visible: true,
	 },
	]
    var nv1 = new niivue.Niivue(({
  		show3Dcrosshair: true,//displays crosshair
  		backColor: [0.8, 0.8, 1, 1]}))//sets the background color.
  	nv1.setSliceType(nv1.sliceTypeRender)//I don't know exactly what this does but when it is removed all three directions of slices are displayed
  	nv1.attachTo('gl1')//attaches the entire image to the canvas.
    for (var q = 0; q<subjectData[1].length; q++){
      
      nv1.loadMeshes([
    	 {url: subjectData[0][1][subjectData[1][q]], rgba255 : [0, 0, 255, 255]},
    	])//displays the fiber
    }
  	
  	nv1.setClipPlane([-0.1, 270, 0])	//displays the clip plane. displaced in the x? direction by 0.1. rotated 270 degrees about the z axis. The third number clearly has to do with angle and initial position in the z direction but my experimentation is not leading me to a clear result.
    nv1.loadVolumes(volumeList1)//Displayes the brain.
  }
  function arrayBasedOnSubjectAndSite(array, prefix){
    id = array[0]
    site = array[1]
    newArray = [prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_model-DKI_FA.nii.gz",[prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-AntFrontal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ARC_L_tractography.trk",prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ARC_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ATR_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ATR_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CGC_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CGC_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CST_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CST_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-IFO_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-IFO_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ILF_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ILF_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Motor_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Occipital_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Orbital_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-PostParietal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SLF_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SLF_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SupFrontal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SupParietal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Temporal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-UNC_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-UNC_R_tractography.trk"]]
    return newArray
  }
  function initialize(prefix){
    array = d3.tsv(prefix+'/derivatives/afq/participants.tsv')
    const makeRealArray = async () => {
        const a = await array
        newArray = []
        for (i = 0; i< a.length; i++){
            newArray.push([a[i].participant_id, a[i].site])
        };
        classArray = []
        for (i=0; i<newArray.length; i++){
            classArray.push({id: newArray[i][0], session: newArray[i][1]})
        }
        dropVueApp.subjects = classArray
        dropVueApp.subjectId = classArray[0]
        changeVolumeList([arrayBasedOnSubjectAndSite(newArray[0], prefix), checkboxVueApp.bundles])
    };
    makeRealArray()
  }

  function returnBundleTypes(){
    bundleTypes = [
            {name: 'Anterior Frontal', id: 0, colorNumber: 0},
            {name: 'Arcuate Fasciculus-Left', id: 1, colorNumber: 18},
            {name: 'Arcuate Fasciculus-Right', id: 2, colorNumber: 19},
            {name: 'Anterior Thalamic Radiation-Left', id: 3, colorNumber: 0},
            {name: 'Anterior Thalamic Radiation-Right', id: 4, colorNumber: 1},
            {name: 'Cingulate Cingulum-Left', id: 5, colorNumber: 4},
            {name: 'Cingulate Cingulum-Right', id: 6, colorNumber: 5},
            {name: 'Corticospinal Tract-Left', id: 2, colorNumber: 2},
            {name: 'Corticospinal Tract-Right', id: 3, colorNumber: 3},
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

  function returnColorArray(){
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
        rgbarray.push(array)
    }
    return rgbarray
  }