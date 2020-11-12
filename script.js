const editorDiv = document.querySelector('.editor');
const oninput = function() {
    pre.innerHTML = hljs.highlightAuto(textarea.value).value;
};
const updatecaret = function() {
    const offset = textarea.selectionDirection === "forward" ? textarea.selectionEnd : textarea.selectionStart;
    caretpre.innerHTML = pre.innerText.slice(0, offset)+'<span class="caret"></span>'+pre.innerText.slice(offset);
}
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
setTimeout(oninput)

textarea.addEventListener('scroll', function() {
    caretpre.scrollTop = pre.scrollTop = textarea.scrollTop;
});
