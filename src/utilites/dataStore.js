import { defineStore } from 'pinia'
import {listObjects, listCommonPrefixes,getUrl} from "./utilites/awsHelper.js"
import {getLastPathComponent, groupByExtension, filterBySubfolder, filterBySubstring, getTrkBundles} from "./utilites/logic.js"

//here were creating a pinia store for all the logic surrounding the data we are getting from our aws bucket
//we want to handle all the aws requests and data manipulation in one place.
//we then provide the processed data and some setter functions to the components that need it
const dataStore = defineStore({
    id: 'nameLater',
    state: () => ({
        //paths
        datasets: null,
        dataset: null,
        subjects: [],
        sessions: [],
        //raw data
        files: [],
        //processed data
        scans: [],
        bundles: [],
        //selections
        subject: null,
        session: null,
        scan: null,
        selectedBundles: [],
    }),
    actions: {
        //aws requests + response parsing
        async getSubjects() {
            let output = [];
            let params = {
                Bucket: this.dataset.value.bucket,
                Prefix: this.dataset.value.prefix,
                Delimiter: "/"
            }
            let prefixes = await listCommonPrefixes(params, dataset.value.participantsSize);
            subjects = getSubfolders(prefixes);
        },
        async getSessions(){
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
            sessions = output;
        },

        //getters - only needed for computed values
        getScanLink() {
            //check if scan is selected
            if(this.scan === null) return null
            //return link to scan
            let params = {
                Bucket: this.dataset.bucket,
                Key: this.scan.path
            }
            return getUrl(params)
        },
        //implement later
        getBundleLinks(){

        },
        get
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
