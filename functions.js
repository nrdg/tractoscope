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
    console.log(array)
    id = array[0]
    site = array[1]
    newArray = [prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_model-DKI_FA.nii.gz",[prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-AntFrontal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ARC_L_tractography.trk",prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ARC_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ATR_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ATR_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CGC_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CGC_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CST_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-CST_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-IFO_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-IFO_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ILF_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-ILF_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Motor_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Occipital_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Orbital_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-PostParietal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SLF_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SLF_R_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SupFrontal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-SupParietal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-Temporal_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-UNC_L_tractography.trk", prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+site+"/clean_bundles/"+id+"_ses-HBNsite"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_space-RASMM_model-CSD_desc-prob-afq-UNC_R_tractography.trk"]]
    return newArray
  }
  function initialize(prefix){
    console.log(prefix)
    array = d3.tsv('https://fcp-indi.s3.amazonaws.com/data/Projects/HBN/BIDS_curated/derivatives/afq/participants.tsv')
    array.then((a) => {
        console.log(a[1], 'please work please')
    })
    
    /*
    console.log(array)
    const makeRealArray = async () => {
    const a = await array
    console.log(a[1])
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
    console.log(classArray)
    };
    makeRealArray()
    */
  }
  /*
  function initialize(prefix){
    string = prefix+'/derivatives/afq/participants.tsv'
    array = d3.tsv('./participants.tsv')
    console.log(array)
    const makeRealArray = async () => {
        const a = await arraycheck different row
        console.log(a[1].participant_id, a[1].site)
        newArray = []
        for (i = 0; i< a.length; i++){
            newArray.push([a[i].participant_id, a[i].site])
        };
        const b = await newArray
        console.log(b)
        classArray = []
        for (i=0; i<newArray.length; i++){
            classArray.push({id: newArray[i][0], session: newArray[i][1]})
        }
        dropVueApp.subjects = classArray
        dropVueApp.subjectId = classArray[0]
        console.log(classArray)
        changeVolumeList([arrayBasedOnSubjectAndSite(newArray[0], prefix), []])
    };
    makeRealArray()
  }
  */