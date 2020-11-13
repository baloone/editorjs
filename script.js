const editorContainerDiv = document.querySelector('.editor-container');
const editorDiv = document.querySelector('.editor');
const linesDiv = document.querySelector('.lines');

const highligh = function(timeout) {
    var toId = null;
    return function() {
        if (toId) clearTimeout(toId);
        toId = setTimeout(() => {
            toId = null;
            const res = hljs.highlightAuto(textarea.value);
            editorContainerDiv.setAttribute('lang', res.language || "");
            pre.innerHTML = res.value;
        }, timeout);
    }
}(300);

const oninput = function(e) {
    pre.innerText = textarea.value;
    highligh();
};

const updatelines = function() {
    const curLines = linesDiv.children.length;
    const newLines = textarea.value.split('\n').length;
    textarea.value.split('\n').slice(curLines).forEach((e,i) => {
        const div = document.createElement('div');
        div.innerText = curLines+i+1;
        linesDiv.append(div);
    });
    [...linesDiv.children].slice(newLines).forEach(e => e.outerHTML = '');
};
const updatecaret = function() {
    const span1 = document.createElement('span');
    const spancaret = document.createElement('span');
    const span2 = document.createElement('span');
    const offset = textarea.selectionDirection === "forward" ? textarea.selectionEnd : textarea.selectionStart;
    span1.innerText = pre.innerText.slice(0, offset);
    span2.innerText = pre.innerText.slice(offset);
    spancaret.classList.add('caret');
    caretpre.innerHTML = "";
    caretpre.append(span1, spancaret, span2);
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
window.addEventListener('click', () => editorDiv.classList.remove("focused"));
window.addEventListener('blur', () => editorDiv.classList.remove("focused"));
setTimeout(oninput);
setTimeout(updatecaret);
