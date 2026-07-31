let field = document.querySelector('.field')
for(let i = 0; i < 432; i += 1){
    let cell = document.createElement('div')
    cell.classList.add('cell')
    field.appendChild(cell)
}
var start_color = '#001aff';
var main_color = 'grey';
var fill_mode = false
var IS_CLICKED = false
var color_gallery = {
    'red': '#ff0000',// 1 - красный
    'blue': '#001aff',// 2 - синий
    'green': '#00ff1a',// 3 - зелёный
    'yellow': '#fffb00',// 4 - жёлтый
    'orange': '#ff5e00',// 5 - оранжевый
    'light-blue': '#00ffd5',// 6 - голубой
    'purple': '#c800ff'// 7 - фиолетовый
};
var color_to_index = {
    '#ff0000': '1',
    '#001aff': '2',
    '#00ff1a': '3',
    '#fffb00': '4',
    '#ff5e00': '5',
    '#00ffd5': '6',
    '#c800ff': '7',
    'grey': '0'
};
var index_to_color = {
    '0': 'grey',
    '1': '#ff0000',
    '2': '#001aff',
    '3': '#00ff1a',
    '4': '#fffb00',
    '5': '#ff5e00',
    '6': '#00ffd5',
    '7': '#c800ff'
};
let cells = document.querySelectorAll('.cell')
for(let i = 0; i < cells.length; i++){
    let cell = cells[i];
    cell.style.border='1px solid lightgrey';
    cell.addEventListener('click', function(){
        cell.style.backgroundColor=start_color;
        fill_mode = false;
    })
    cell.addEventListener('mouseover', function(){
        if (IS_CLICKED){
            cell.style.backgroundColor=start_color;
            fill_mode = false;
        }
    })
    cell.addEventListener('mousedown', function(){
        if (fill_mode){
            for(let y = 0;  y < cells.length;  y++){
                cells[y].style.backgroundColor=start_color;
            }
        }else {
            cell.style.backgroundColor=start_color;
        }
    })
}
let color_cells = document.querySelectorAll('.color-cell')
for(let i = 0; i < color_cells.length; i++){
    let color_cell = color_cells[i];
    color_cell.addEventListener('click', function(){
        let color_class = '';
        fill_mode = false;
        if (color_cell.classList.contains('red')) color_class = 'red';
        else if (color_cell.classList.contains('blue')) color_class = 'blue';
        else if (color_cell.classList.contains('green')) color_class = 'green';
        else if (color_cell.classList.contains('yellow')) color_class = 'yellow';
        else if (color_cell.classList.contains('orange')) color_class = 'orange';
        else if (color_cell.classList.contains('light-blue')) color_class = 'light-blue';
        else if (color_cell.classList.contains('purple')) color_class = 'purple';
        start_color = color_gallery[color_class]
        document.querySelector('.selected').classList.remove('selected')
        color_cell.classList.add('selected')
    })
}
document.addEventListener('mousedown', function(){
    IS_CLICKED = true;
})
document.addEventListener('mouseup', function(){
    IS_CLICKED = false;
})
document.querySelector('.eraser').addEventListener('click', function(){
    start_color = main_color;
    document.querySelector('.selected').classList.remove('selected')
    this.classList.add('selected')
    fill_mode = false;
})
document.querySelector('.fill-tool').addEventListener('click', function(){
    fill_mode = true
    document.querySelector('.selected').classList.remove('selected')
    this.classList.add('selected')
})
// сохранение в cookie каждую минуту
setInterval(function(){
    let res_color_container = '';
    let all_cells = document.querySelectorAll('.cell');
    for (let r = 0; r < all_cells.length; r++){
        let cell = all_cells[r];
        let cur_back = cell.style.backgroundColor;
        let colorHex = cur_back;
        if (cur_back && cur_back.includes('rgb')) {
            let rgb = cur_back.match(/\d+/g);
            if (rgb) {
                colorHex = '#' + ((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1);
            }
        }
        let color_index = color_to_index[colorHex] || '0';
        res_color_container += color_index;
    }
    document.cookie = `pixel_result=${res_color_container};max-age=100000`;
},60000);
// подгрузка из cookie
function get_result_cookie(){
    let cookies = document.cookie.split('; ');
    for (let f = 0; f < cookies.length; f++){
        let cookie = cookies[f].split('=');
        if (cookie[0] == 'pixel_result'){
            return cookie[1]
        }
    }
    return null;
}
// отображение cookie на странице
let final_pic = get_result_cookie()
if (final_pic && final_pic.length === 432){
    let final_cell = document.querySelectorAll('.cell');
    for (let h = 0; h < 432; h++){
        let color_index = final_pic[h];
        let color_value = index_to_color[color_index] || 'grey';
        final_cell[h].style.backgroundColor = color_value;
    }
}

const saveButton = document.querySelector('.save-tool');
const saveElement = document.querySelector('.field');
saveButton.addEventListener('click', function(){
    const options = {
        quality: 1,
        bgcolor: '#ffffff'
    };
    domtoimage.toJpeg(saveElement, options).then(function(dataUrl){
        const link = document.createElement('a');
        link.download = 'pixel.jpg';
        link.href = dataUrl;
        link.click();
    })
    .catch((error) => {
            console.error('Ошибка при сохранении изображения:', error);
        });
});
