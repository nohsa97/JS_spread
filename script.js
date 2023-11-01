const table = document.querySelector('.table_container');
const selected_cell = document.querySelector('.selected');
const export_btn = document.querySelector('.export_btn');


const COR = 10;
const ROW = 10;

const ALPA = [
    'A','B','C','D','E','F','G','H','I'
];

let spread = [];

class Cell {
    constructor (isHeader, disabled, data, row, col, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.col = col;
        this.active = active;
    }
}

start();
// console.log(spread);

function start() {
    for(var i = 0; i < ROW; i++){
        let spread_row = [];
        for(var j = 0; j < COR; j++) {
            const data = initData(i,j);

            const  new_cell = new Cell(data.header, data.disabled, data.data, i, j, false);
            spread_row.push(new_cell);
        }
        spread.push(spread_row);
    }
    drawTable();
}

function initData(row,col) {

    if(row == 0 && col == 0) {
        return { header : true , disabled : true , data : ""};
    }

    else if(row == 0 && col > 0){
        return { header : true , disabled : true , data : ALPA[col - 1]};
    }

    else if(row > 0 && col == 0 ) {
        return { header : true , disabled : true , data : row};
    }

    else {
        return { header : false , disabled : false , data : ""};
    }
    
}

function createTable (cell) {

    const cell_ele =  document.createElement('input');
    cell_ele.className = 'cell';
    cell_ele.id = 'cell_' + cell.row + cell.col;
    cell_ele.value = cell.data;
    cell_ele.disabled = cell.disabled;

    if (cell.disabled == true) {
        cell_ele.setAttribute('disabled', "");
    }

    if(cell.isHeader == true) {
        cell_ele.className += ' header';
    }

    cell_ele.onfocus = () => cellOnclick(cell);
    cell_ele.onblur = (e) => cellOnblue(cell);
    cell_ele.onchange = (e) => cellChange(cell, e.target.value);

    return cell_ele;
}

function drawTable() {
    for(var i = 0; i < ROW; i++){
        const row_data = document.createElement('div');
        row_data.className = 'table';
        for(var j = 0; j < COR; j++) {
            row_data.appendChild(createTable(spread[i][j]));
            // row_data.append(col_data);
        }
        table.append(row_data);
    }

}

function cellOnclick(cell) {
    selected_cell.innerHTML = 'Cell: ' + ALPA[cell.col - 1] + cell.row;
    const selected_core = document.querySelector(`#cell_${cell.row}${cell.col}`);
    const selected_col = document.querySelector(`#cell_0${cell.col}`);
    const selected_row = document.querySelector(`#cell_${cell.row}0`);

    console.log(selected_core);
    selected_core.className += ' active';
    selected_col.className += ' active';
    selected_row.className += ' active';
}

function cellChange(cell, data) {
    console.log(cell);
    console.log(data);
    spread[cell.row][cell.col].data = data;
    console.log(spread);
}

function cellOnblue(cell) {
    const selected_core = document.querySelector(`#cell_${cell.row}${cell.col}`);
    const selected_col = document.querySelector(`#cell_0${cell.col}`);
    const selected_row = document.querySelector(`#cell_${cell.row}0`);

    selected_core.classList.remove('active');
    selected_col.classList.remove('active');
    selected_row.classList.remove('active');
}


export_btn.onclick = function (e) {
    let csv = "";
    for (var i = 0; i < spread.length; i++) {
        if (i === 0) continue;
        csv += spread[i].filter(item => !item.isHeader)
            .map(item => item.data)
            .join(',')+ "\r\n";
    }

    const csvObj = new Blob([csv]);
    console.log('csvObj', csvObj);

    const csvUrl = URL.createObjectURL(csvObj);
    console.log('csvUrl', csvUrl);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = 'spreadsheet name.csv';
    a.click();
}