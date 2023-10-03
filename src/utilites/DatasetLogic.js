import datasetConfig from "/public/datasetConfig.json"
import * as d3 from 'd3'

export async function updateSubjectList(dataset){
    if(dataset){
        if (dataset.hasOwnProperty('participantList')){
            let link = dataset.prefix+dataset.participantList
            const x = await d3.tsv(link)
            const subjectList = combindDuplicateSites(x)
            return subjectList
        }else{
            console.log("dataset does not contain participants filepath, using default")
            const x = await d3.tsv(dataset.prefix+datasetConfig.default.participantList)
            const subjectList = combindDuplicateSites(x)
            return subjectList
        }
    } else {
        throw new Error("Dataset is not defined");
    }
}

function combindDuplicateSites(list){
    var subjectList = []
    list.forEach(element => {
        const index = subjectList.findIndex(obj => obj.site === element.site) //returns -1 if no obj exists
        if(index == -1){
            var object = {id: element.participant_id,site: [element.site]}
            subjectList.push(object)
        }else{
            subjectList[index].site.push(element.site)
        }
    });
    return subjectList
}

export function getVolumeLink(dataset,subjectId,site,scan){
    let prefix = dataset.prefix
    let name = dataset.name
    var id = null
    if(typeof subjectId === 'string'){
        id = subjectId
    }if(subjectId.hasOwnProperty("id")){
        id = subjectId.id
    }
    if(dataset.name == "HBN"){
        var link = prefix+"/afq/"+id+"/ses-"+name+"site"+site+"/"+id+"_ses-"+name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_"+scan+'.nii.gz'
    }else{
        var link = prefix+"/afq/"+id+"/"+site+"/"+id+"_dwi_"+scan+".nii.gz"
    }
    return link
}

export function getBundleLink(dataset,subjectId,site,fileName){

    var id;
    if(typeof subjectId == "string"){
        id = subjectId
    }if(subjectId.hasOwnProperty("id")){
        id = subjectId.id
    }else{
        throw new error("subjectId does not have property id",subjectId);
    }
    const name = dataset.name
    const prefix = dataset.prefix
    if(dataset.name == "HBN"){
        var link = prefix+"/afq/"+id+"/ses-"+name+"site"+site+"/clean_bundles/"+id+"_ses-"+name+"site"+site+fileName
    }else{
        var link = prefix+"/afq/"+id+"/"+site+"/"+id+fileName
    }
    return link
}



// this is still fairly slow, dispite in theory only fetching the first byte of the file
// this may be due to a aws request limitation/restriction
export async function checkLink(url) {
    try {
        const response = await fetch(url,{method: 'GET',headers:{'range' : 'bytes=0-1'}})
        return (response.status >= 200 && response.status <= 299);
    } catch (error) {
        return false;
    }
}
