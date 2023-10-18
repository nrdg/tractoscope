<template>
    <header>AWS SDK TEST</header>
    <select v-model="dataset">
        <option v-for="(value, key) in datasets" :value="value">{{ key }}</option>
    </select>
    <SearchableListSelect v-model:selected="subject" :list="subjects"></SearchableListSelect>
    <select v-model="session" v-if="sessions.length > 1">
        <option v-for="item in sessions" :value="item">{{ item.folderName }}</option>
    </select>
    <select v-model="scan">
        <option v-for="item in scans" :value="item">{{ item.name }}</option>
    </select>
    <div v-if="session">session: {{ session.folderName }}</div>
    <MultiSelect :items="bundles" v-model:selected="selectedBundles"/>
    <br>
    <NiivueRender :dataset="dataset" :scan="scan" :bundles="selectedBundles"/>
</template>


<script setup>
import {onMounted, ref, watch, computed} from 'vue'
import datasets from "../public/datasets.json"
import {listObjects, listCommonPrefixes} from "./utilites/awsHelper.js"
import {getLastPathComponent, groupByExtension, filterBySubfolder, filterBySubstring, getTrkBundles} from "./utilites/logic.js"
import SearchableListSelect from "./components/SearchableListSelect.vue"
import MultiSelect from './components/MultiSelect.vue'
import NiivueRender from './components/NiivueRender.vue'

const dataset = ref(datasets[Object.keys(datasets)[0]]);
const subjects = ref([]);
const subject = ref();
const sessions = ref([]);
const session = ref();
const trks = ref([]);

const trxs = ref([]);
//trx will be the trx that contains dataset.trxFile.fileName somewhere in its filename
const trx = computed(() => {
    if (trxs.value.length === 0) {
        return null
    }

    const matchingTrxs = trxs.value.filter((trx) => {
        let fileName = getLastPathComponent(trx);
        return fileName.includes(props.dataset.trxFile.fileName);
    })

    if (matchingTrxs.length === 0) {
        return null
    } else if (matchingTrxs.length > 1) {
        throw new Error('dataset.trxFile is not a configured property')
    } else {
        return matchingTrxs[0]
    }
})


const niis = ref([]);
//value = {name, path} for all nii's that are in dataset.scans
//if niis.length == 0, then value = []
const scans = computed(() => {
    if (niis.value.length > 0) {
        let output = niis.value.reduce((acc, path, i) => {
            dataset.value.scans.forEach((name) => {
                if (path.includes(name)) {
                    acc.push({ name, path });
                }
            });
            return acc;
        }, []);
        return output;
    } else {
        return [];
    }
});
const scan = ref({});

/**
 * Bundles is an object with the following properties
 * bundles = {
 *  type: "trk" or "trx"
 *  names: ["name","name"]
 *  trkFiles(opt): [{name: {path, rgba255}]
 *  trxFile(opt): path  //still need to implement way to select specific bundles
 * }
 */
const bundles = ref([]);
const selectedBundles = ref([]);

async function getSubfolders(prefixes){
    let output = []
    for (let prefix of prefixes) {
        let folderName = getLastPathComponent(prefix);
        output.push({prefix, folderName});
    }
    return output
}

//updates subjects with [{prefix,folderName}...]
//sets subject to first subject in subjects
async function getSubjects() {
    let output = [];
    let params = {
        Bucket: dataset.value.bucket,
        Prefix: dataset.value.prefix,
        Delimiter: "/"
    }
    let prefixes = await listCommonPrefixes(params, dataset.value.participantsSize);
    output = getSubfolders(prefixes);
    return output
}

//this will fail if there are subfolders, but no folder for sessions
//for example
//          subject-|
//                  |-bundles-|
//                  |-clean_bundles-|
//for this it would set sessions = [bundles,clean_bundles]
//if there is no folder for sessions it will return [{prefix: subject.value.prefix, folderName: "root"}]
async function getSessions() {
    let output = [];
    let params = {
        Bucket: dataset.value.bucket,
        Prefix: subject.value.prefix,
        Delimiter: "/"
    }
    let prefixes = await listCommonPrefixes(params, 100);
    output = getSubfolders(prefixes);
    if(output.length == 0){
        return [{prefix: subject.value.prefix, folderName: "root"}];
    }
    return output
}

//if more than one trx it will pick first one listed
//updates trks, trx and nii files
async function updateFiles() {
    trxs.value = [];
    trks.value = [];
    niis.value = [];

    let params = {
        Bucket: dataset.value.bucket,
        Prefix: session.value.prefix,
        // Delimiter: "/"
    }
    let files = await listObjects(params);
    let keys = files.Contents.map((item) => item.Key);
    var filesByExtension = groupByExtension(keys);

    //if dataset contains subfolder, get files in that subfolder
    //replace filesByExtension[subfolder.extension] with files in subfolder that have that extension
    if(dataset.value.subfolders){
        for(let subfolder of dataset.value.subfolders ){
            let params = {
                Bucket: dataset.value.bucket,
                Prefix: session.value.prefix + subfolder.path,
                Delimiter: "/"
            }
            let subfolderFiles = await listObjects(params);
            let subfolderKeys = subfolderFiles.Contents.map((item) => item.Key);
            let subfolderFilesByExtension = groupByExtension(subfolderKeys);
            filesByExtension[subfolder.extension] = subfolderFilesByExtension[subfolder.extension];
        }
    }


    if(filesByExtension["nii.gz"]){
        niis.value = filesByExtension["nii.gz"];
    }
    if(filesByExtension["trk"]){
        trks.value = filesByExtension["trk"];
    };
    if(filesByExtension["trx"]){
        trxs.value = filesByExtension["trx"];
    };
    if(filesByExtension["nii.gz"]){
        niis.value = filesByExtension["nii.gz"];
    };
}
onMounted(async () => {
    subjects.value = await getSubjects();
    subject.value = subjects.value[0];
    sessions.value = await getSessions();
    session.value = sessions.value[0];
    updateFiles();

});

watch(dataset, async () => {
    subjects.value = await getSubjects();
    subject.value = subjects.value[0];
});
watch(subject, async () => {
    sessions.value = await getSessions();
    session.value = sessions.value[0];
});
watch(session, async () => {
    updateFiles();
});
watch(trks, (newVal) => {
    if(newVal.length > 0){
        bundles.value = getTrkBundles(dataset.value.trkFiles,trks.value)
    }
});
watch(trxs, (newVal) => {
});
watch(scans, (newVal) => {
    if(!newVal.includes(scan.value)){
        if(newVal.includes(scan.value)){
        }else{
            scan.value = newVal[0];
        }
    }
});
</script>

<style></style>
