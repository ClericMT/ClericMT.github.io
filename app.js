//create canvas
const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//constants
const initRadius = 15
const inactiveColour = '#0000FF'
const activeColour = '#33FFFF'
const logHoursColour = '#40E0D0'
const lineColourOff = '#0000FF'
const lineColourOn = '#33FFFF'

//nodes and lines
let n = []
let l = []

//map mouse coordinates on click
canvas.onmousedown = function(e) {
    let ctrl = false
    if (e.ctrlKey){
        ctrl = true
    }
    let rect = canvas.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    nodeClicked(x, y, ctrl);
    draw();
}

function updateLines(){
    let i = 0;
    let j = 0;
    let h = 0;
    let k = 0;
    for (i = 0; i < n.length; i ++){
        for (j = 0; j < n.length; j ++){
            for (h = 0; h < n[i].ins.length; h ++){
                for (k = 0; k < n[j].outs.length; k ++){
                    if (n[i].ins[h] == n[j].id && n[j].outs[k] == n[i].id && n[i].id !== n[j].id){
                        l.push({x1: n[i].x, y1: n[i].y, x2: n[j].x, y2: n[j].y, colour: lineColourOff})
                    }
                }
            }
        }
    }
}

//turns node on, off
function nodeOn(index){
    let i = 0;
    n[index].io = true;
    n[index].colour = activeColour;
    if (typeof l[0] !== 'undefined'){
        for (i = 0; i < l.length; i++){
            if (n[index].x == l[i].x1){
                l[i].colour = lineColourOn
            }
        }
    }
}

function nodeOff(index){
    n[index].io = false;
    n[index].colour = inactiveColour;
}

//creates new node and appends ins/outs with other nodes
function nodeCreate(x, y){
    let i = 0
    let nodeIns = []
    for (i = 0; i < n.length; i++){
        if (n[i].io == true){
            nodeIns.push(n[i].id) //ins for new node
            n[i].outs.push(n.length) //outs for active nodes
        }
    }
    n.push({id: n.length, io: false, x: x, y: y, radius: initRadius, colour: inactiveColour, logger: false, ins: nodeIns, outs: []});
}

//connects active nodes to ctrl-clicked node
function nodeConnect(index){
    let i = 0;
    for (i = 0; i < n.length; i++){
        if (n[i].io == true){
            n[i].ins.push(n[index].id)
            n[index].outs.push(n[i].id)
        }
    }
}

function nodeClicked(x, y, ctrl){
    //do any nodes exist? create one : check clicked node's status
    typeof n[0] !== 'undefined' ? check(x, y) : n.push({id: n.length, io: false, x: x, y: y, radius: initRadius, colour: inactiveColour, logger: false, ins: [], outs: []})

    //clicks on node
    function check(x, y) {
        let i = 0
        for (i = 0; i < n.length; i++){
            //determines if node has been clicked
            function isNodeClicked() {
                let minX = (n[i].x - n[i].radius);
                let maxX = (n[i].x + n[i].radius);
                let minY = (n[i].y - n[i].radius);
                let maxY = (n[i].y + n[i].radius);
                if (minX < x && maxX > x && minY < y && maxY > y){
                    return true;
                } else {return false}
            }
            //determines next action
            if (isNodeClicked() && n[i].io == false && ctrl == true){
                nodeConnect(i)
                nodeOn(i)
                break;
            }
            else if (isNodeClicked() && n[i].io == false){
                nodeOn(i);
                break;
            } else if (isNodeClicked() && n[i].io == true) {
                nodeOff(i);
                break;
            } else if (isNodeClicked()) {
                break;
            } else if (i == n.length - 1){
                nodeCreate(x, y);
                break;
            }
        }
    }
}

//draws nodes and lines
function draw() {
    console.log(n.length)
    updateLines()
    const ctx = canvas.getContext('2d');
    let i = 0;
    let j = 0;
    //lines
    for (j = 0; j < l.length; j++){
        ctx.beginPath();
        ctx.moveTo(l[j].x1, l[j].y1);
        ctx.lineTo(l[j].x2, l[j].y2);
        ctx.strokeStyle = l[j].colour;
        ctx.stroke();
    }
    //nodes
    for (i = 0; i < n.length; i++){
        ctx.beginPath();
        ctx.arc(n[i].x, n[i].y, n[i].radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = n[i].colour;
        ctx.fill()
    }
}