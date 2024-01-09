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
        loadTrx: false,
    }),
    getters: {
        getLoadTrx(){
            return this.loadTrx;
        },
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
            if(this.files["trx"] && this.datasets[this.dataset].trxFile){
                return "trx";
            }
            if(this.files["trk"] && this.datasets[this.dataset].trkFiles){
                return "trk";
            }
            return "none";
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
        //this returns a list of links for bundles
        getTrks(){
            //
            // let x = getTrkBundles(this.getDataset.trkFiles, this.trks).filter(trk =>
            //     this.selectedBundles.includes(trk.name)).map(trk =>
            //         {name:trk.name, getUrl({Bucket: this.getDataset.bucket, Key: trk.filepath, rgba255: trk.rgba255})});
            if(this.getBundleType === "trk"){
                let x = getTrkBundles(this.getDataset.trkFiles,this.trks)
                let out = [];
                for(let trk of x){
                    if(this.selectedBundles.includes(trk.name)){
                        let url = getUrl({Bucket: this.getDataset.bucket, Key: trk.filepath, rgba255: trk.rgba255})
                        let rgba255 = trk.rgba255;
                        out.push({url, rgba255});
                    }
                }
                return out;
            }
            return null;
        },
        getTrxUrl() {
            let trx = this.trxs.filter(trx => trx.includes(this.getDataset.trxFile.fileName));
            if (trx.length === 0) {
                return null;
            } else if (trx.length > 1) {
                throw new Error(`Multiple versions of ${this.getDataset.trxFile.fileName} found.`);
            } else {
                return getUrl({Bucket: this.getDataset.bucket, Key: trx[0]});
            }
        },
        getPngs(){
            return this.files["png"];
        }
    },
    actions: {
        setLoadTrx(val){
            this.loadTrx = val;
        },
        async setDataset(key){
            if(key in this.datasets){
                this.files = [];
                this.trks = [];
                this.trxs = [];
                this.scans = [];
                this.scan = null;
                this.subjects = [];
                this.subject = null;
                this.sessions = [];
                this.session = null;
                this.selectedBundles = [];
                this.dataset = key;
                await this.updateSubjects();
                await this.updateSessions();
                await this.updateFiles();
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
            return
        },
        async setSubject(subject){
            this.files = [];
            this.trks = [];
            this.trxs = [];
            this.scans = [];
            this.scan = null;
            this.sessions = [];
            this.session = null;
            this.subject = subject;

            await this.updateSessions();
            await this.updateFiles();
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
            if(this.getSubject){
                let output = [];
                let params = {
                    Bucket: this.getDataset.bucket,
                    Prefix: this.getSubject.prefix,
                    Delimiter: "/"
                }
                let prefixes = await listCommonPrefixes(params, 100);
                output = getSubfolders(prefixes);
                if(output.length == 0){
                    this.sessions =  [{prefix: this.getSubject.prefix, folderName: "root"}];
                    this.session = this.sessions[0];
                    return
                }else{
                    this.sessions = output;
                    this.session = this.sessions[0];
                    return
                }
            }
        },
        setSession(session){
            this.files = [];
            this.trks = [];
            this.trxs = [];
            this.scans = [];
            this.scan = null;
            this.session = session;
            this.updateFiles();
        },

        //files
        async updateFiles() {
            let params = {
                Bucket: this.getDataset.bucket,
                Prefix: this.getSession.prefix,
            }
            console.log(params)
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
                let output = niis.reduce((acc, path) => {
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
                this.scans = [];
                this.scan = null;
            }
        },
        setScan(scan){
            this.scan = scan;
        },

    }
})
