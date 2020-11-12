const editorDiv = document.querySelector('.editor');
const linesDiv = document.querySelector('.lines');
const oninput = function() {
    pre.innerHTML = hljs.highlightAuto(textarea.value).value;
};

const updatelines = function() {
    linesDiv.innerHTML = textarea.value.split('\n').map((e,i) => `<span>${i+1}</span>`).join('<br>');
};
const updatecaret = function() {
    const offset = textarea.selectionDirection === "forward" ? textarea.selectionEnd : textarea.selectionStart;
    caretpre.innerHTML = pre.innerText.slice(0, offset)+'<span class="caret"></span>'+pre.innerText.slice(offset);
    updatelines();
};
textarea.addEventListener('input', oninput);
textarea.addEventListener('input', updatecaret);
textarea.addEventListener('click', updatecaret);
textarea.addEventListener('keydown', updatecaret);
textarea.addEventListener('keyup', updatecaret);
editorDiv.addEventListener('click', e => {
    editorDiv.classList.add("focused");
    e.stopPropagation();
});
window.addEventListener('click', e => {
    editorDiv.classList.remove("focused");
});
setTimeout(oninput);
setTimeout(updatecaret);
