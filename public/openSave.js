let downloadBtn=$(".icon-download");
let openBtn=$(".icon-open");

//download

downloadBtn.click(function(){
    let fileName=$(".title-bar").text();
    let jsonData=JSON.stringify(cellData)
    let file=new Blob([jsonData],{type:"application/json"});
    
    let a=document.createElement("a");
    a.href=URL.createObjectURL(file);
    a.download=fileName;
    a.click();
})

//open
openBtn.click(function(){
    let input=document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change",(e)=>{
        let fr=new FileReader();
        let files=input.files;
        let fileObj=files[0];
        
        // sheetName=e.target.files[0].name.split(" ")[0];
        
        let newFileName=e.target.files[0].name.split(".")[0];
        changeFileName(newFileName);
        fr.readAsText(fileObj);
        fr.addEventListener("load",(e)=>{
            let readSheetData=JSON.parse(fr.result);
            for(let i=0;i<Object.keys(readSheetData).length;i++){
                sheetName=Object.keys(readSheetData)[i];
                if (sheetName in cellData){
                    sheetName+="("+i+")";
                }
                let pSheet=readSheetData[Object.keys(readSheetData)[i]];
                emptySheet();
                $(".sheet-tab.selected").removeClass("selected"); 
                cellData[sheetName]=pSheet;
                // cellData[sheetName]={};
                totalSheets+=1;
                lastlyAddedSheet+=1;
                selectedSheet=sheetName;
                $(".sheet-tab-container").append(`<div class="sheet-tab selected">${sheetName}</div>`)
                addSheetEvents();
                loadSheet(); 
            }
        })
    })
})