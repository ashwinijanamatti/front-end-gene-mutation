var savedData;

/*

    Retrieving the Data using the API
 */
d3.json("https://dcc.icgc.org/api/v1/projects/GBM-US/mutations?field=id,mutation,type,chromosome,start,end&size=100&order=desc", function(error, data){

    savedData = data.hits;

    for(var i=0;i<savedData.length;i++){

        console.log(savedData[i]);
    }
});
