let total_T = 0;
let T1=0;
let T2=0;
let T=0;
let l1;
let l2;
let a;
let theta = 0;
let v = 0;
let last_time = null;
const lever = document.getElementById("lever")
const weight1 = document.getElementById("weight1");
const weight2 = document.getElementById("weight2");
const error = document.getElementById("error");
error.style.display = "none"
const error_txt = document.getElementById("error-text");
let pos1 = 5;
let pos2 = -5;
let w_1_element = document.getElementById("w_1")
let w_2_element = document.getElementById("w_2")
w_1_element.value = 5
w_2_element.value = 5
let w_1 = parseFloat(w_1_element.value)
let w_2 = parseFloat(w_2_element.value)
let last1,last2;
weight1.style.left = `calc(50% + ${(pos1/2.54) *96}px)`
weight2.style.left = `calc(50% + ${(pos2/2.54) *96}px)`
weight1.style.width = `${Math.max(w_1*10,1)}px`;
weight1.style.height = `${Math.max(w_1*10,1)}px`;
weight2.style.width = `${Math.max(w_1*10,1)}px`;
weight2.style.height = `${Math.max(w_1*10,1)}px`;
w_1_element.addEventListener("input",() =>{
    // console.log(parseFloat(w_1_element.value) !== NaN && parseFloat(w_1_element.value) !== 0 && NaN && parseFloat(w_1_element.value)>0);
    if (!Number.isNaN(parseFloat(w_1_element.value)) && parseFloat(w_1_element.value)>0)  {
        w_1 = parseFloat(w_1_element.value);
        last1 = w_1;
        // console.log(w_1);
        close_error(1)
        BoxScale(weight1,w_1);
        console.log(weight1.style.width);
    } else {
        if (Number.isNaN(parseFloat(w_1_element.value))){
            error_message("wieght cannot be empty.",1);
        } else if(parseFloat(w_1_element.value)<=0) {
            error_message("wieght cannot be 0 or less.",1);
        };
        console.log("alskd: ",(last1 != null));
        if (last1 != null){
            console.log("last: ",last1);
            w_1 = last1;
        } else {w_1 = 5;}
        console.log(w_1);
        BoxScale(weight1,w_1);
        console.log(weight1.style.width);
    }
    

});

w_2_element.addEventListener("input",() =>{
    if (!Number.isNaN(parseFloat(w_2_element.value)) && parseFloat(w_2_element.value)>0)  {
        w_2 = parseFloat(w_2_element.value);
        last2 = w_2
        // console.log(w_1);
        BoxScale(weight2,w_2)
        console.log(weight2.style.width);
        close_error(2)
    } else {
        if (Number.isNaN(parseFloat(w_2_element.value))){
            error_message("wieght cannot be empty.",2);
        } else if(parseFloat(w_2_element.value)<=0) {
            error_message("wieght cannot be 0 or less.",2);
        };
        console.log("alskd: ",(last2 != null));
        if (last2 != null){
            console.log("last2: ",last2);
            w_2 = last2;
        } else {w_2 = 5;}
        console.log(w_2);
        BoxScale(weight2,w_2)
        console.log(weight2.style.width);
}});
/** @param {MouseEvent} event */
let mouse;
function PixeltoCm(event){
    const rect = lever.getBoundingClientRect();
    const dx =  event.clientX - (rect.left + rect.width/2) 
    const dy = event.clientY -(rect.top+ rect.height/2)
    const distancePx = dx * Math.cos(theta) + dy * Math.sin(theta)
    const distanceCm = distancePx /96 *2.54
    return distanceCm
}

function mousePos(event) {
    
    event.preventDefault();
    return event.clientX;
}

function moving_box(event) {
    // console.log(isDown1)
    if (isDown1){
        event.preventDefault()
        pos1 = PixeltoCm(event);
        weight1.style.left = `calc(50% + ${pos1/2.54 * 96}px)`;
        // console.log(pos1);
    }else if(isDown2){
        event.preventDefault()
        pos2 = PixeltoCm(event);
        weight2.style.left = `calc(50% + ${pos2/2.54 * 96}px)`;
        // console.log(pos1);
    }
    console.log(w_1,w_2)
}
let isDown1,isDown2;
weight1.addEventListener("pointerdown",function(){
    isDown1 = true;
});
weight2.addEventListener("pointerdown",function(){
    isDown2 = true;
});
weight1.addEventListener("pointerup", function(){
    isDown1 = false;
});
weight2.addEventListener("pointerup", function(){
    isDown2 = false;
});
document.addEventListener("pointermove", (event)=> {
    moving_box(event)
});



function animate(current_time){
        if (last_time == null){
            last_time = current_time;
        }
        dt = (current_time - last_time)/1000;
        last_time = current_time;
        l1 = pos1*pos1 * w_1;
        l2 = pos2*pos2 * w_2;
        T1 = pos1 * w_1*9.8;
        T2 = pos2 * w_2 * 9.8;
        T = T1+T2;
        a = T/(l1+l2);

        v+= a * dt;
        v*=0.98
        theta += v*dt;
        const max_angle = 30 * (Math.PI / 180)
        let degree = theta * (180/Math.PI);
        if (theta > max_angle){
            theta = max_angle;
            v = 0;
        }else if (theta < -max_angle){
            theta = -max_angle;
            v = 0;
        };
        lever.style.transform = `translate(-50%,-50%) rotate(${degree}deg)`;
        
        // console.log(`pos1: ${pos1}, pos2: ${pos2}, T: ${T}, I: ${l1+l2}, a: ${a}, degree: ${degree}, dt: ${dt}`);

        requestAnimationFrame(animate);
}
let last_w = []
function error_message(msg,w){
    last_w.push(w);
    if (msg){
        error.style.display = "flex";
        error_txt.textContent = msg;
    }

}

function close_error(w){
    console.log(last_w,w)
    console.log("w in last_w", last_w.filter(item => item != w).length == 0)
    if ( last_w.filter(item => item != w).length == 0){
        error.style.display = "none";
    };
    last_w = last_w.filter(item => item != w);
}
/**
 * 
 * @param {HTMLDivElement} box 
 * @param {*Number} w 
 */
function BoxScale(box,w){
    console.log("w: ",w)
    if (w>50) {
        
        box.style.width = `500px`;
        box.style.height = `500px`;
    } else if(w<1) {
        box.style.width = `10px`;
        box.style.height = `10px`;    
    } else {
        box.style.width = `${w*10}px`
        box.style.height = `${w*10}px`
    }
    console.log("box_width", weight2.style.width)
}
requestAnimationFrame(animate);