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
weight2.style.width = `${Math.max(w_2*10,1)}px`;
weight2.style.height = `${Math.max(w_2*10,1)}px`;
w_1_element.addEventListener("input",()=>{
    if (!Number.isNaN(parseFloat(w_1_element.value)) && parseFloat(w_1_element.value)>0) {
        w_1 = parseFloat(w_1_element.value);
        last1 = w_1;
        close_error(1)
        BoxScale(weight1,w_1);
    } else {
        if (Number.isNaN(parseFloat(w_1_element.value))) {
            error_message("wieght cannot be empty.",1);
        } else if(parseFloat(w_1_element.value)<=0) {
            error_message("wieght cannot be 0 or less.",1);
        }
        w_1 = last1 != null ? last1 : 5;
        BoxScale(weight1,w_1);
    }
});

w_2_element.addEventListener("input",()=>{
    if (!Number.isNaN(parseFloat(w_2_element.value)) && parseFloat(w_2_element.value)>0) {
        w_2 = parseFloat(w_2_element.value);
        last2 = w_2;
        BoxScale(weight2,w_2)
        close_error(2)
    } else {
        if (Number.isNaN(parseFloat(w_2_element.value))) {
            error_message("wieght cannot be empty.",2);
        } else if(parseFloat(w_2_element.value)<=0) {
            error_message("wieght cannot be 0 or less.",2);
        }
        w_2 = last2 != null ? last2 : 5;
        BoxScale(weight2,w_2)
    }
});

/** Convert a pointer's screen position to its position along the lever. */
function PixeltoCm(event){
    const rect = lever.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width/2)
    const dy = event.clientY - (rect.top + rect.height/2)
    const distancePx = dx * Math.cos(theta) + dy * Math.sin(theta)
    return distancePx / 96 * 2.54
}

let activeBox = null;
let activePointerId = null;

function startDragging(event, box) {
    // Editing either weight input must never start a drag on its parent box.
    if (event.target instanceof Element && event.target.closest(".wieght-input")) {
        return;
    }
    if (event.button !== undefined && event.button !== 0) {
        return;
    }

    event.preventDefault();
    activeBox = box;
    activePointerId = event.pointerId;
    try {
        box.setPointerCapture(event.pointerId);
    } catch (_) {
        // Document-level pointer listeners remain as a fallback.
    }
}

function moving_box(event) {
    if (!activeBox || event.pointerId !== activePointerId) {
        return;
    }
    event.preventDefault();
    const position = PixeltoCm(event);
    if (activeBox === weight1) {
        pos1 = position;
        weight1.style.left = `calc(50% + ${pos1/2.54 * 96}px)`;
    } else {
        pos2 = position;
        weight2.style.left = `calc(50% + ${pos2/2.54 * 96}px)`;
    }
}

function stopDragging(event) {
    if (!activeBox || (event.pointerId !== undefined && event.pointerId !== activePointerId)) {
        return;
    }
    const box = activeBox;
    const pointerId = activePointerId;
    activeBox = null;
    activePointerId = null;
    try {
        if (box.hasPointerCapture(pointerId)) {
            box.releasePointerCapture(pointerId);
        }
    } catch (_) {
        // The pointer may already have been released by the browser.
    }
}

weight1.addEventListener("pointerdown", event => startDragging(event, weight1));
weight2.addEventListener("pointerdown", event => startDragging(event, weight2));
document.addEventListener("pointermove", moving_box);
document.addEventListener("pointerup", stopDragging);
document.addEventListener("pointercancel", stopDragging);
window.addEventListener("blur", () => stopDragging({}));

function animate(current_time){
    if (last_time == null) {
        last_time = current_time;
    }
    const dt = (current_time - last_time)/1000;
    last_time = current_time;
    l1 = pos1*pos1 * w_1;
    l2 = pos2*pos2 * w_2;
    T1 = pos1 * w_1*9.8;
    T2 = pos2 * w_2 * 9.8;
    T = T1+T2;
    a = T/(l1+l2);

    v += a * dt;
    v *= 0.98;
    theta += v*dt;
    const max_angle = 30 * (Math.PI / 180);
    let degree = theta * (180/Math.PI);
    if (theta > max_angle) {
        theta = max_angle;
        v = 0;
    } else if (theta < -max_angle) {
        theta = -max_angle;
        v = 0;
    }
    lever.style.transform = `translate(-50%,-50%) rotate(${degree}deg)`;
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
    if (last_w.filter(item => item != w).length == 0){
        error.style.display = "none";
    }
    last_w = last_w.filter(item => item != w);
}

/**
 * @param {HTMLDivElement} box
 * @param {number} w
 */
function BoxScale(box,w){
    if (w>50) {
        box.style.width = `500px`;
        box.style.height = `500px`;
    } else if(w<1) {
        box.style.width = `10px`;
        box.style.height = `10px`;
    } else {
        box.style.width = `${w*10}px`;
        box.style.height = `${w*10}px`;
    }
}
requestAnimationFrame(animate);
