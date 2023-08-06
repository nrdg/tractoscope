import filePathConfig from "/public/filePathConfig.json"
import * as d3 from 'd3'

export async function updateSubjectList(dataset){
    if(dataset){
        const filePath = filePathConfig.participantList
        const x = await d3.tsv(dataset.prefix+filePath)
        const subjectList = combindDuplicateSites(x)
        return subjectList
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
    let link = prefix+"/derivatives/afq/"+id+"/ses-"+name+"site"+site+"/"+id+"_ses-"+name+"site"+site+"_acq-64dir_space-T1w_desc-preproc_dwi_"+scan+'.nii.gz'
    return link
}

export function getBundleLink(dataset,subjectId,site,bundle){
    var fileName = null
    if(typeof bundle == "string"){
        fineName = bundle
    }if(bundle.hasOwnProperty("fileName")){
        fileName = bundle.fileName
    }

    var id = null
    if(typeof subjectId == "string"){
        id = subjectId
    }if(subjectId.hasOwnProperty("id")){
        id = subjectId.id
    }
    const name = dataset.name
    const prefix = dataset.prefix
    let link = prefix+"/derivatives/afq/"+id+"/ses-"+name+"site"+site+"/clean_bundles/"+id+"_ses-"+name+"site"+site+fileName
    return link
}

//this function works, but is fetching the whole file, which is farily slow, (around 4 seconds to load all scans on 50mbps connection)
//also throws an error in console if scan doesn't exist, which is not desired. though the functionality of the page is unaffected
//using method: 'head' does not work as it is blocked by cors policy
export async function checkLink(url) {
    try {
        const response = await fetch(url)
        return (response.status >= 200 && response.status <= 299);
    } catch (error) {
        return false;
    }
}