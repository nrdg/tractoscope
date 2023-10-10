<template>
    <header>AWS SDK TEST</header>
    <select v-model="dataset">
        <option v-for="(value, key) in datasets" :value="value">{{ key }}</option>
    </select>
    <select v-model="subject">
        <option v-for="item in subjects" :value="item">{{ item.fileName }}</option>
    </select>
    <br>
    dataset {{ dataset }} <br>
    subject {{ subject }} <br>
    session {{ session }} <br>
    trxs {{ trxs }} <br>
    trks {{ trks }} <br>
    niis {{ niis }} <br>
</template>


<script setup>
import {onMounted, ref, watch, computed} from 'vue'
import datasets from "../public/datasets.json"
import {listObjects, listCommonPrefixes} from "./utilites/awsHelper.js"
import {getLastPathComponent, groupByExtension, filterBySubfolder} from "./utilites/logic.js"
import SearchableListSelect from "./components/SearchableListSelect.vue"

const dataset = ref(datasets[Object.keys(datasets)[0]]);
const subjects = ref([]);
const subject = ref();
const sessions = ref([]);
const session = ref();
const trks = ref([]);
const trxs = ref([]);
const niis = ref([]);
const nii = ref();

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
        Prefix: session.value.prefix
    }
    let files = await listObjects(params);
    let keys = files.Contents.map((item) => item.Key);
    let filesByExtension = groupByExtension(keys);


    if (dataset.value.subfolders.trk) {
        let path = params.Prefix + dataset.value.subfolders.trk;
        filesByExtension["trk"] = filterBySubfolder(filesByExtension["trk"], path);
    }
    console.log(filesByExtension);
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
    subjects.value = [];
    subjects.value = await listCommonPrefixes(params.value, 3000);
});
</script>

<style></style>
