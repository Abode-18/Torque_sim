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
let pos1 = 5;
let pos2 = -5;
let w_1 = 5
let w_2 = 5
weight1.style.left = `calc(50% - ${(pos1/2.54) *96}px)`
weight2.style.left = `calc(50% - ${(pos2/2.54) *96}px)`


/** @param {MouseEvent} event */
let mouse;
function PixeltoCm(event){
    const rect = lever.getBoundingClientRect();
    const dx = (rect.left + rect.width/2) - event.clientX
    const dy = (rect.top+ rect.height/2) - event.clientY
    const distancePx = dx * Math.cos(-theta) + dy * Math.sin(-theta)
    const distanceCm = distancePx /96 *2.54
    return distanceCm
}

function mousePos(event) {
    
    event.preventDefault();
    return event.clientX;
}

function moving_box(event) {
    if (isDown1){
        event.preventDefault()
        pos1 = PixeltoCm(event);
        weight1.style.left = `${pos1/2.54 * 96}px`;
        // console.log(pos1);
    }else if(isDown2){
        event.preventDefault()
        pos2 = PixeltoCm(event);
        weight2.style.left = `${pos2/2.54 * 96}px`;
        // console.log(pos1);
    }
}
let isDown1,isDown2;
weight1.addEventListener("mousedown",function(){
    isDown1 = true;
});
weight2.addEventListener("mousedown",function(){
    isDown2 = true;
});
weight1.addEventListener("mouseup", function(){
    isDown1 = false;
});
weight2.addEventListener("mouseup", function(){
    isDown2 = false;
});
document.addEventListener("mousemove", (event)=> {
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
        lever.style.transform = `translate(-50%,-50%) rotate(${-degree}deg)`;
        
        console.log(`pos1: ${pos1}, pos2: ${pos2}, T: ${T}, I: ${l1+l2}, a: ${a}, degree: ${degree}, dt: ${dt}`);

        requestAnimationFrame(animate);
}


requestAnimationFrame(animate);