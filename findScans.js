function findAllScans(id, session, prefix){
    array = [{url: "model-DKI_FA", name: 'T1W'}]
    scanType = ['b0', 'brain_mask', 'mapping_from-DWI_to_MNI_xfm', 'model-CSD_APM', 'model-CSD_diffmodel', 'model-DKI_AWF', 'model-DKI_diffmodel', 'model-DKI_MD', 'model-DKI_MK', 'DTI_diffmodel', 'DTI_FA', 'seed_mask', 'stop_mask']
    for (i = 0; i<scanType.length; i++){
        array.push({url: scanType[i], name: scanType[i]})
    }
    return array
}