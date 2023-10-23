import { defineStore } from 'pinia'
import datasets from "../public/datasets.js"
import {listObjects, listCommonPrefixes,getUrl} from "./utilites/awsHelper.js"
import {getLastPathComponent, groupByExtension, filterBySubfolder, filterBySubstring, getTrkBundles} from "./utilites/logic.js"

//here were creating a pinia store for all the logic surrounding the data we are getting from our aws bucket
//we want to handle all the aws requests and data manipulation in one place.
//we then provide the processed data and some setter functions to the components that need it
const dataStore = defineStore({
    id: 'store',
    state: () => ({
        //lists
        datasets: datasets,
        // {name, path}
        subjects: [],
        sessions: [],
        //raw data
        files: [],
        //processed data
        scans: [],
        bundles: [],
        //selections
        dataset: Object.keys(datasets)[0],
        subject: null,
        session: null,
        scan: null,
        selectedBundles: [],
    }),
    actions: {
        //aws requests + response parsing
        async updateSubjects() {
            let params = {
                Bucket: this.getDataset().bucket,
                Prefix: this.getDataset().prefix,
                Delimiter: "/"
            }
            let prefixes = await listCommonPrefixes(params, this.getDataset().participantsSize);
            this.subjects = getSubfolders(prefixes);
            this.subject = this.subjects[0];
        },

        async updateSessions(){
            let output = [];
            let params = {
                Bucket: this.getDataset().bucket,
                Prefix: this.subject.value.prefix,
                Delimiter: "/"
            }
            let prefixes = await listCommonPrefixes(params, 100);
            output = getSubfolders(prefixes);
            if(output.length == 0){
                return [{prefix: subject.value.prefix, folderName: "root"}];
            }
            this.sessions = output;
            this.session = this.sessions[0]
        },
        async updateFiles() {
            //clear files
            this.files = [];

            let params = {
                Bucket: this.getDataset().bucket,
                Prefix: this.sessions.prefix,
            }
            let files = await listObjects(params);
            let keys = files.Contents.map((item) => item.Key);
            var filesByExtension = groupByExtension(keys);

            //if dataset contains subfolder, get files in that subfolder
            //replace filesByExtension[subfolder.extension] with files in subfolder that have that extension
            if(this.getDataset().subfolders){
                for(let subfolder of this.getDataset().subfolders ){
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


            this.files = filesByExtension;
        },
        //getters
        getScanLink() {
            //check if scan is selected
            if(this.scan === null) return null
            //return link to scan
            let params = {
                Bucket: this.getDataset.bucket,
                Key: this.scan.path
            }
            return getUrl(params)
        },
        //implement later
        getBundleLinks(){
            //check if bundles are selected
            if(this.selectedBundles.length == 0) return null
        },
        getDataset(){
            return this.datasets[this.dataset];
        },
        getDatasets(){
            return this.datasets;
        },
        getScans(){
            //check if niis exist
            if (this.files["nii.gz"].length > 0) {
                //match all names to files and return {name,path}
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
        },
        setDataset(key){
            if(key in this.datasets){
                this.dataset = key;
            } else {
                throw new Error(`Dataset with key ${key} not found.`);
            }
        },
        setSubject(subject){
            this.subject = subject;
        },
        setScan(scan){
            this.scan = scan;
        },
        setSession(session){
            this.session = session;
        },
        setSelectedBundles(bundles){
            this.selectedBundles = bundles;
        },

    },
    //watchers
    watch: {
        dataset(newVal,oldVal) {
            this.getSubjects();
        },
        subject(newVal,oldVal) {
            this.getSessions();
        },
        session(newVal,oldVal){
            this.getFiles();
        },
        files(newVal,oldVal){
            this.getScans();
            this.getBundles();
            this.
        },
    }
})
