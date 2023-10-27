import { defineStore } from 'pinia'
import datasets from "../../public/datasets.json"
import {listObjects, listCommonPrefixes,getUrl} from "./awsHelper.js"
import {groupByExtension, getSubfolders, getTrkBundles} from "./logic.js"

//here were creating a pinia store for all the logic surrounding the data we are getting from our aws bucket
//we want to handle all the aws requests and data manipulation in one place.
//we then provide the processed data and some setter functions to the components that need it
export const useDataStore = defineStore({
    id: 'dataStore',
    state: () => ({
        datasets: datasets,
        dataset: Object.keys(datasets)[0],

        subjects: [],
        subject: null,

        sessions: [],
        session: null,

        files: [],
        trks: [],
        trxs: [],

        scans: [],
        scan: null,
        selectedBundles: [],
    }),
    getters: {
        //Dataset functions
        getDataset(){
            return this.datasets[this.dataset];
        },
        getDatasets(){
            return this.datasets;
        },
        getDatasetKey(){
            return this.dataset;
        },

        getSubjects(){
            return this.subjects;
        },
        getSubject(){
            return this.subject;
        },

        getSessions(){
            return this.sessions;
        },
        getSession(){
            return this.session;
        },

         //scans
        getScans(){
            return this.scans;
        },
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
        getScan(){
            return this.scan;
        },
        getBundleType(){
            if(this.files["trx"]){
                return "trx";
            }
            if(this.files["trk"]){
                return "trk";
            }
            return null;
        },
        //returns a list of all bundle names
        getBundleNames(){
            if(this.getBundleType === "trx"){
                if(this.getDataset.bundles){
                    return this.getDataset.bundles;
                }
                return [];
            }
            if(this.getBundleType === "trk"){
                let x = getTrkBundles(this.getDataset.trkFiles, this.trks)
                return x.map(trk => trk.name);
            }
            return [];
        },
        //this returns a list of bundle names
        getSelectedBundleNames(){
            return this.selectedBundles;
        },
        getSelectedTrx(){
            throw new notImplementedError();
        },
        //this returns a list of links for bundles
        getSelectedTrks(){
            return getTrkBundles(this.getDataset.trkFiles, this.trks).filter(trk => this.selectedBundles.includes(trk.name)).map(trk => getUrl({Bucket: this.getDataset.bucket, Key: trk.filepath}));
        },
        getTrxBundle() {
            let trx = this.trxs.filter(trx => trx.path.includes(this.getDataset.trxFile.fileName));
            if (trx.length === 0) {
                throw new Error(`No version of ${this.getDataset.trxFile.fileName} found.`);
            } else if (trx.length > 1) {
                throw new Error(`Multiple versions of ${this.getDataset.trxFile.fileName} found.`);
            } else {
                return trx[0];
            }
        },

    },
    actions: {
        setDataset(key){
            if(key in this.datasets){
                this.dataset = key;
            } else {
                throw new Error(`Dataset with key ${key} not found.`);
            }
        },
        selectBundle(name){
            if(!this.selectedBundles.includes(name) && this.getBundleNames.includes(name)){
                this.selectedBundles.push(name);
            }
        },
        deselectBundle(name){
            if(this.selectedBundles.includes(name)){
                this.selectedBundles = this.selectedBundles.filter(bundle => bundle !== name);
            }
        },
        //subjects
        async updateSubjects() {
            let params = {
                Bucket: this.getDataset.bucket,
                Prefix: this.getDataset.prefix,
                Delimiter: "/"
            }
            let prefixes = await listCommonPrefixes(params, this.getDataset.participantsSize);
            this.subjects = getSubfolders(prefixes);
            this.subject = this.subjects[0];
        },
        setSubject(subject){
            this.subject = subject;
        },

        //sessions
        //this will fail if there are subfolders, but no folder for sessions
        //for example
        //          subject-|
        //                  |-bundles-|
        //                  |-clean_bundles-|
        //for this it would set sessions = [bundles,clean_bundles]
        //if there is no folder for sessions it will return [{prefix: subject.value.prefix, folderName: "root"}]
        async updateSessions(){
            let output = [];
            let params = {
                Bucket: this.getDataset.bucket,
                Prefix: this.getSubject.prefix,
                Delimiter: "/"
            }
            let prefixes = await listCommonPrefixes(params, 100);
            output = getSubfolders(prefixes);
            if(output.length == 0){
                return [{prefix: this.getSubject.prefix, folderName: "root"}];
            }
            this.sessions = output;
            this.session = this.sessions[0]
        },
        setSession(session){
            this.session = session;
        },

        //files
        async updateFiles() {
            let params = {
                Bucket: this.getDataset.bucket,
                Prefix: this.getSession.prefix,
            }
            let files = await listObjects(params);
            let keys = files.Contents.map((item) => item.Key);
            var filesByExtension = groupByExtension(keys);

            //if dataset contains subfolder, get files in that subfolder
            //replace filesByExtension[subfolder.extension] with files in subfolder that have that extension
            if(this.getDataset.subfolders){
                for(let subfolder of this.getDataset.subfolders ){
                    let params = {
                        Bucket: this.getDataset.bucket,
                        Prefix: this.getSession.prefix + subfolder.path,
                        Delimiter: "/"
                    }
                    let subfolderFiles = await listObjects(params);
                    let subfolderKeys = subfolderFiles.Contents.map((item) => item.Key);
                    let subfolderFilesByExtension = groupByExtension(subfolderKeys);
                    filesByExtension[subfolder.extension] = subfolderFilesByExtension[subfolder.extension];
                }
            }

            this.files = filesByExtension;
            if(this.files["nii.gz"]){
                this.updateScans(this.files["nii.gz"])
            }
            if(this.files["trk"]){
                this.trks = this.files["trk"];
            }else{
                this.trks = [];
            }
            if(this.files["trx"]){
                this.trxs = this.files["trx"];
            }else{
                this.trxs = [];
            }
            return;
        },
        updateScans(niis){
            if (niis.length > 0) {
                //match all names to files and return {name,path}
                let output = niis.reduce((acc, path, i) => {
                    this.getDataset.scans.forEach((name) => {
                        if (path.includes(name)) {
                            acc.push({ name, path });
                        }
                    });
                    return acc;
                }, []);
                this.scans = output;
                //check for scan with same name as previous scan and use that, otherwise pick first
                if(this.getScan){
                    let scanWithName = this.scans.find(scan => scan.name === this.getScan.name);
                    if(scanWithName){
                        this.scan = scanWithName;
                    }else{
                        this.scan = this.scans[0];
                    }
                }else{
                    this.scan = this.scans[0];
                }
            } else {
                console.log("no scans found for subject")
                this.scans = [];
                this.scan = null;
            }
        },
        setScan(scan){
            this.scan = scan;
        },

    }
})
