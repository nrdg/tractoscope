async function changeVolumeList(subjectData, opacityValue, colors) {
    var volumeList1 = [
	// first item is background image
	{
	   url: subjectData[0][0],
	   colorMap: "gray",
	 },
	
	]
    var nv1 = new niivue.Niivue(({
  		show3Dcrosshair: true,//displays crosshair
  		backColor: [1, 1, 1, 1]}))//sets the background color.
  	nv1.setSliceType(nv1.sliceTypeRender)//all three directions of slices are displayed if removed.
  	nv1.attachTo('gl1')//attaches the entire image to the canvas.
    bundleUrls = []
    for (var q = 0; q<subjectData[1].length; q++){
        bundleUrls.push({url: subjectData[0][1][subjectData[1][q]], rgba255: colors[q]})
    }
    await nv1.loadMeshes(bundleUrls)//displays the fiber
    for (var q = 0; q<subjectData[1].length; q++){
        nv1.setMeshProperty(nv1.meshes[q].id, "fiberColor", "Fixed")
    }
    nv1.setClipPlane([-0.1, 270, 0])//displays the clip plane. displaced in the x? direction by 0.1. rotated 270 degrees about the z axis. The third number clearly has to do with angle and initial position in the z direction but my experimentation is not leading me to a clear result.
    nv1.loadVolumes(volumeList1)//Displayes the brain.
	//nv1.setOpacity(1, opacityValue)
	nv1.scene.volScaleMultiplier = opacityValue*10
	console.log(opacityValue*10)
    await nv1.meshes
  }  