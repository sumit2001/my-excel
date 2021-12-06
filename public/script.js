let defaultProperties={
    text:"",
    "font-weight":"",
    "font-style":"",
    "text-decoration":"",
    "text-align":"left",
    "background-color":"#ffffff",
    "color":"#000000",
    "font-family":"Noto Sans",
    "font-size":"14px"
}

let cellData={
    "Sheet1":{}
}

let selectedSheet="Sheet1";
let totalSheets=1;
let lastlyAddedSheet=1;
let lastClick=[];
let currFileName="Book-1";

$(document).ready(function(){
    let cellContainer=$(".input-cell-container");
    
    for(let i=1;i<100;i++){    
        let ans="";
        let n=i;
        while(n>0){
            let rem=n%26;
            if(rem==0){
                ans="Z"+ans;
                n=Math.floor(n/26)-1;
            }else{
                ans=String.fromCharCode(rem-1+65)+ans;
                n=Math.floor(n/26);
            }
        }
        let column=$(`<div class="column-name colId-${i}" id="colCod-${ans}">${ans}</div>`);
        $(".column-name-container").append(column);
        let row=$(`<div class="row-name" id="rowId-${i}">${i}</div>`);
        $(".row-name-container").append(row);
    } 

    for(let i=1;i<100;i++){
        let row=$(`<div class="cell-row"></div>`);
        for(let j=1;j<100;j++){
            let colCode=$(`.colId-${j}`).attr("id").split("-")[1];
            let column=$(`<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="code-${colCode}"></div>`);
            row.append(column);
        }
        $(".input-cell-container").append(row);
    }

    $(".align-icon").click(function(){
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");    
    })

    $(".style-icon").click(function(){
        $(this).toggleClass("selected");    
    })

    function selectBorder(rowId,colId){
        fthis=$(`#row-${rowId}-col-${colId}`);
        if(rowId>1){
            let topCellSelected=$(`#row-${rowId-1}-col-${colId}`).hasClass("selected");
            if(topCellSelected){
                $(fthis).addClass("top-cell-selected");
                $(`#row-${rowId-1}-col-${colId}`).addClass("bottom-cell-selected");
            }
        }
        if(rowId<100){
            let bottomCellSelected=$(`#row-${rowId+1}-col-${colId}`).hasClass("selected");
            if(bottomCellSelected){
                $(fthis).addClass("bottom-cell-selected");
                $(`#row-${rowId+1}-col-${colId}`).addClass("top-cell-selected");
            }
        }
        if(colId>1){
            let leftCellSelected=$(`#row-${rowId}-col-${colId-1}`).hasClass("selected");
            if(leftCellSelected){
                $(fthis).addClass("left-cell-selected");
                $(`#row-${rowId}-col-${colId-1}`).addClass("right-cell-selected");
            }
        }
        if(colId<100){
            let rightCellSelected=$(`#row-${rowId}-col-${colId+1}`).hasClass("selected");
            if(rightCellSelected){
                $(fthis).addClass("right-cell-selected");
                $(`#row-${rowId}-col-${colId+1}`).addClass("left-cell-selected");
            }
        }
    }
    $(".input-cell").click(function(e){
        
        if (e.shiftKey) {
            let prowId=lastClick[0][0];
            let pcolId=lastClick[0][1];
            let [rowId,colId]=getRowCol(this);
            let smrowId=Math.min(prowId,rowId);
            let lgrowId=Math.max(prowId,rowId);
            let smcolId=Math.min(pcolId,colId);
            let lgcolId=Math.max(pcolId,colId);
            for(var i=smrowId;i<=lgrowId;i++){
                for(var j=smcolId;j<=lgcolId;j++){
                    $(`#row-${i}-col-${j}`).addClass("selected");
                    selectBorder(i,j);
                }
            }
        
        }
        else if(e.ctrlKey){
            let [rowId,colId]=getRowCol(this);
            selectBorder(rowId,colId);
        }else{
            
            $(".input-cell.selected").removeClass("top-cell-selected");
            $(".input-cell.selected").removeClass("bottom-cell-selected");
            $(".input-cell.selected").removeClass("right-cell-selected");
            $(".input-cell.selected").removeClass("left-cell-selected");
            $(".input-cell.selected").removeClass("selected");
        }
        $(this).addClass("selected");
        changeHeader(this);
        lastClick=[];
        lastClick.push(getRowCol(this));
        formulaSetUp(this);
        $(".file-options-modal").remove();
        $(".file-rename-modal").remove();
        $(".sheet-rename-modal").remove();
    });

    function formulaSetUp(e){
        let [rowId,colId]=getRowCol(e);
        let col=$(e).attr("data").split("-")[1];
        $(".formula-editor.selected-cell").empty();
        $(".formula-editor.selected-cell").append(document.createTextNode(col+rowId));
        $(".formula-editor.formula-input").empty();
        $(".formula-editor.formula-input").append(document.createTextNode($(e).text()));
    }

    function changeHeader(ele){
        let [rowId,colId]=getRowCol(ele);
        let cellInfo=defaultProperties;
        if(cellData[selectedSheet][rowId]&&cellData[selectedSheet][rowId][colId])
            cellInfo=cellData[selectedSheet][rowId][colId];
        cellInfo["font-weight"]?$(".icon-bold").addClass("selected"):$(".icon-bold").removeClass("selected");
        cellInfo["font-style"]?$(".icon-italic").addClass("selected"):$(".icon-italic").removeClass("selected");
        cellInfo["text-decoration"]?$(".icon-underline").addClass("selected"):$(".icon-underline").removeClass("selected");
        let alignment=cellInfo["text-align"];
        $(".align-icon.selected").removeClass("selected");
        $(".icon-align-"+alignment).addClass("selected");
        $(".background-color-picker").val(cellInfo["background-color"])
        $(".text-color-picker").val(cellInfo["color"])
        $(".font-family-selector").val(cellInfo["font-family"])
        $(".font-family-selector").css("font-family",cellInfo["font-family"])
        $(".font-size-selector").val(cellInfo["font-size"])
    }

    $(".input-cell").dblclick(function(){
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable","true");
        $(this).focus();
    })

    $(".input-cell").blur(function(){
        $(".input-cell.selected").attr("contenteditable","false");
        updateCell("text",$(this).text()); 
    })

    $(".input-cell-container").scroll(function(){
        $(".column-name-container").scrollLeft(this.scrollLeft);
        $(".row-name-container").scrollTop(this.scrollTop);
    })

    $(".column-name").click(function(e){
        let colNum=e.delegateTarget.className.split("-")[2];
        for(var i=1;i<100;i++){
            $(`#row-${i}-col-${colNum}`).addClass("selected");
            selectBorder(i,colNum);
        }
    })

    $(".row-name").click(function(e){
        let rowNum=e.target.id.split("-")[1];
        console.log(rowNum);
        for(var i=1;i<100;i++){
            $(`#row-${rowNum}-col-${i}`).addClass("selected");
            selectBorder(rowNum,i);
        }
    })

    $(".select-all").click(function(){
        for(var i=1;i<100;i++){
            for(var j=1;j<100;j++){
                $(`#row-${i}-col-${j}`).addClass("selected");
                selectBorder(i,j);
            }   
        }   
    })

    $(".icon-right-scroll").click(function(){
        $(".sheet-tab.selected").next().click();
    })

    $(".icon-left-scroll").click(function(){
        $(".sheet-tab.selected").prev().click();
    })

    $("#row-1-col-1").dblclick();
});

function getRowCol(ele){
    let idArray=$(ele).attr("id").split("-");
    let rowId=parseInt(idArray[1]);
    let colId=parseInt(idArray[3]);
    return [rowId,colId];
}

function updateCell(property,value,defaultPossible){
    $(".input-cell.selected").each(function(){
        $(this).css(property,value);
        let [rowId,colId]=getRowCol(this);
        if(cellData[selectedSheet][rowId]){
            if(cellData[selectedSheet][rowId][colId]){
                cellData[selectedSheet][rowId][colId][property]=value;
            }else{
                cellData[selectedSheet][rowId][colId]={...defaultProperties};
            }
        }else{
            cellData[selectedSheet][rowId]={};
            cellData[selectedSheet][rowId][colId]={...defaultProperties};
            cellData[selectedSheet][rowId][colId][property]=value;
        }
        if(defaultPossible && JSON.stringify(cellData[selectedSheet][rowId][colId])===JSON.stringify(defaultProperties)){
            delete cellData[selectedSheet][rowId][colId];
            if(Object.keys(cellData[selectedSheet][rowId]).length==0){
                delete cellData[selectedSheet][rowId];
            }
        }
    });
}

$(".icon-bold").click(function(){
    if($(this).hasClass("selected")){
        updateCell("font-weight","",true);
    }else{
        updateCell("font-weight","bold",false);
    }
})

$(".icon-italic").click(function(){
    if($(this).hasClass("selected")){
        updateCell("font-style","",true);
    }else{
        updateCell("font-style","italic",false);
    }
})

$(".icon-underline").click(function(){
    if($(this).hasClass("selected")){
        updateCell("text-decoration","",true);
    }else{
        updateCell("text-decoration","underline",false);
    }
})

$(".icon-align-left").click(function(){
    if(!$(this).hasClass("selected")){
        updateCell("text-align","left",true);
    }
})

$(".icon-align-center").click(function(){
    if(!$(this).hasClass("selected")){
        updateCell("text-align","center",false);
    }
})

$(".icon-align-right").click(function(){
    if(!$(this).hasClass("selected")){
        updateCell("text-align","right",false);
    }
})

$(".color-fill-icon").click(function(){
    $(".background-color-picker").click();
})

$(".color-fill-text").click(function(){
    $(".text-color-picker").click();
})

$(".background-color-picker").change(function(){
    updateCell("background-color",$(this).val());
})

$(".text-color-picker").change(function(){
    updateCell("color",$(this).val());
})

$(".font-family-selector").change(function(){
    updateCell("font-family",$(this).val());
    $(".font-family-selector").css("font-family",$(this).val())
})

$(".font-size-selector").change(function(){
    updateCell("font-size",$(this).val());
})

function emptySheet(){
    let sheetInfo=cellData[selectedSheet];
    for(let i of Object.keys(sheetInfo)){
        for(let j of Object.keys(sheetInfo[i])){
            $(`#row-${i}-col-${j}`).text("");
            $(`#row-${i}-col-${j}`).css("background-color","#ffffff");
            $(`#row-${i}-col-${j}`).css("color","#000000");
            $(`#row-${i}-col-${j}`).css("text-align","left");
            $(`#row-${i}-col-${j}`).css("font-weight","");
            $(`#row-${i}-col-${j}`).css("font-style","");
            $(`#row-${i}-col-${j}`).css("text-decoration","");
            $(`#row-${i}-col-${j}`).css("font-family","Noto Sans");
            $(`#row-${i}-col-${j}`).css("font-size","14px");
        }
    }
}

function changeFileName(newFileName){
    $(".title-bar").empty();
    $(".title-bar").append(document.createTextNode(newFileName));
}

function loadSheet(){
    let sheetInfo=cellData[selectedSheet];
    for(let i of Object.keys(sheetInfo)){
        for(let j of Object.keys(sheetInfo[i])){
            let cellInfo=cellData[selectedSheet][i][j];
            $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
            $(`#row-${i}-col-${j}`).css("background-color",cellInfo["background-color"]);
            $(`#row-${i}-col-${j}`).css("color",cellInfo["color"]);
            $(`#row-${i}-col-${j}`).css("text-align",cellInfo["text-align"]);
            $(`#row-${i}-col-${j}`).css("font-weight",cellInfo["font-weight"]);
            $(`#row-${i}-col-${j}`).css("font-style",cellInfo["font-style"]);
            $(`#row-${i}-col-${j}`).css("text-decoration",cellInfo["text-decoration"]);
            $(`#row-${i}-col-${j}`).css("font-family",cellInfo["font-family"]);
            $(`#row-${i}-col-${j}`).css("font-size",cellInfo["font-size"]);
        }
    }
}

$(".icon-add").click(function(){
    emptySheet();
    $(".sheet-tab.selected").removeClass("selected");
    let sheetName="Sheet"+(lastlyAddedSheet+1);
    cellData[sheetName]={};
    totalSheets+=1;
    lastlyAddedSheet+=1;
    selectedSheet=sheetName;
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">${sheetName}</div>`)
    addSheetEvents();
});

$(".menu-file").hover(function(){
    if($(".file-options-modal").length==0){
        $(".menu-bar").append(`<div class="file-options-modal">
                                    <div class="file-new file-option">New</div>
                                    <div class="file-rename file-option">Rename</div>
                                    <div class="file-save file-option">Save</div>
                                    <div class="file-open file-option">Open</div>
                                </div>`);
        $(".file-new").click(function(){
            $(".icon-add").click();
            $(".file-options-modal").remove();
        })
        $(".file-open").click(function(){
            $(".icon-open").click();
            $(".file-options-modal").remove();
        })
        $(".file-save").click(function(){
            $(".icon-download").click();
            $(".file-options-modal").remove();
        })
        $(".file-rename").click(function(){
            $(".file-options-modal").remove();
            $(".container").append(`<div class="file-rename-modal">
                                            <h4 class="modal-title">Rename File To:</h4>
                                            <input type="text" class="new-file-name" placeholder="File Name" />
                                            <div class="file-action-buttons">
                                            <div class="file-submit-button">Rename</div>
                                            <div class="cancel-button">Cancel</div>
                                            </div>
                                        </div>`);
                $(".cancel-button").click(function(){
                    $(".file-rename-modal").remove();
                });
                $(".file-submit-button").click(function(){
                    let newFileName=$(".new-file-name").val();
                    changeFileName(newFileName);
                    $(".file-rename-modal").remove();
                });
        })
        $(".file-options-modal").mouseleave(function(){
            $(".file-options-modal").remove();
        })
    }    
});

function addSheetEvents(){
    $(".sheet-tab.selected").click(function(){
        if(!$(this).hasClass("selected")){
            selectSheet(this);
        }
    });
    $(".sheet-tab.selected").contextmenu(function(e){
        e.preventDefault();
        selectSheet(this);
        if($(".sheet-options-modal").length==0){    
            $(".container").append(`<div class="sheet-options-modal">
                                        <div class="sheet-rename">Rename</div>
                                        <div class="sheet-delete">Delete</div>
                                    </div>`);
            $(".sheet-rename").click(function(){
                $(".container").append(`<div class="sheet-rename-modal">
                                            <h4 class="modal-title">Rename Sheet To:</h4>
                                            <input type="text" class="new-sheet-name" placeholder="Sheet Name" />
                                            <div class="action-buttons">
                                            <div class="submit-button">Rename</div>
                                            <div class="cancel-button">Cancel</div>
                                            </div>
                                        </div>`);
                $(".cancel-button").click(function(){
                    $(".sheet-rename-modal").remove();
                });
                $(".submit-button").click(function(){
                    let newSheetName=$(".new-sheet-name").val();
                    if (newSheetName in cellData){
                        newSheetName+=lastlyAddedSheet;
                    }
                    $(".sheet-tab.selected").text(newSheetName);
                    let newCellData={};
                    for(let key in cellData){
                        if(key!=selectedSheet){
                            newCellData[key]=cellData[key];
                        }else{
                            newCellData[newSheetName]=cellData[key];
                        }
                        
                    }
                    cellData=newCellData;
                    selectedSheet=newSheetName;
                    $(".sheet-rename-modal").remove();
                })
            });

            $(".sheet-delete").click(function(){
                if(Object.keys(cellData).length>1){
                    // $(".sheet-tab.selected").remove();
                    let currSheetName=selectedSheet;
                    let currSheet=$(".sheet-tab.selected");
                    let currSheetIndex=Object.keys(cellData).indexOf(selectedSheet);
                    if(currSheetIndex==0){
                        $(".sheet-tab.selected").next().click();
                    }else{
                        $(".sheet-tab.selected").prev().click();
                    }
                    delete cellData[currSheetName];
                    currSheet.remove();
                }else{
                    alert("Sorry, there is only 1 Sheet. You Can't delete that.");
                }
            })
        }
        $(".sheet-options-modal").css("left",e.pageX+"px");
    }) 
}
addSheetEvents();

$(".container").click(function(){
    $(".sheet-options-modal").remove();
})

function selectSheet(ele){
    $(".sheet-tab.selected").removeClass("selected");
    $(ele).addClass("selected");
    emptySheet();
    selectedSheet=$(ele).text();
    loadSheet();
}

let selectedCells=[];
let cut=false;

$(".icon-copy").click(function(){
    selectedCells=[];
    $(".input-cell.selected").each(function(){
        selectedCells.push(getRowCol(this));
    })
});

$(".icon-paste").click(function(){
    if(selectedCells.length>0)
        emptySheet();
    let [rowId,colId]=getRowCol($(".input-cell.selected")[0]);
    let rowDistance=rowId-selectedCells[0][0];
    let colDistance=colId-selectedCells[0][1];
    for(let cell of selectedCells){
        let newRowId=rowDistance+cell[0];
        let newColId=colDistance+cell[1];
        if(!cellData[selectedSheet][newRowId]){
            cellData[selectedSheet][newRowId]={};
        }
        console.log(cellData);
        cellData[selectedSheet][newRowId][newColId]={...cellData[selectedSheet][cell[0]][cell[1]]};
        if(cut){
            delete cellData[selectedSheet][cell[0]][cell[1]];
            if(Object.keys(cellData[selectedSheet][cell[0]]).length==0){
                delete cellData[selectedSheet][cell[0]]
            }
        }
    }
    if(cut){
        selectedCells=[];
        cut=false;
    }
    loadSheet();
})

$(".icon-cut").click(function(){
    $(".input-cell.selected").each(function(){
        selectedCells.push(getRowCol(this));
    })
    cut=true;
})

