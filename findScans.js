async function findAllScans(id, session, prefix){
    array = [{url: "model-DKI_FA", name: 'T1W'}]
    scanType = ['b0', 'model-CSD_APM', 'model-CSD_diffmodel', 'model-DKI_AWF', 'model-DKI_diffmodel', 'model-DKI_MD', 'model-DKI_MK', 'model-DTI_diffmodel', 'model-DTI_FA']
    for (i = 0; i<scanType.length; i++){
        response = await fetch(prefix+"/derivatives/afq/"+id+"/ses-HBNsite"+session+"/"+id+"_ses-HBNsite"+session+"_acq-64dir_space-T1w_desc-preproc_dwi_"+scanType[i]+'.nii.gz')
        if (response.ok){
            array.push({url: scanType[i], name: scanType[i]})
        }
        else{
            console.log(scanType[i], 'not found')
        }
    }
    return array
}
