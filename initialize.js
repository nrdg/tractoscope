function initialize(prefix){
    array = d3.tsv(prefix+'/derivatives/afq/participants.tsv')
    const makeRealArray = async () => {
        const a = await array
        newArray = []
        for (i = 0; i< a.length; i++){
            newArray.push([a[i].participant_id, a[i].site])
        };
        classArray = []
        for (i=0; i<newArray.length; i++){
            classArray.push({id: newArray[i][0], session: newArray[i][1]})
        }
        dropVueApp.subjects = classArray
        dropVueApp.subjectId = classArray[0]
        console.log('it gets called')
        dropVueApp3.scans = findAllScans(dropVueApp.subjectId.id, dropVueApp.subjectId.session, prefix)
        dropVueApp3.scan = findAllScans(dropVueApp.subjectId.id, dropVueApp.subjectId.session, prefix)[0]
        changeVolumeList([arrayBasedOnSubjectAndSite(newArray[0], prefix, dropVueApp3.scan.url), checkboxVueApp.bundles])
    };
    makeRealArray()
  }