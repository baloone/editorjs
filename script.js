const editorContainerDiv = document.querySelector('.editor-container');
const editorDiv = document.querySelector('.editor');
const linesDiv = document.querySelector('.lines');

const textContent = function(element) {
    return element.textContent;
};

const insertText = function(el, offset, text) {
    var children = el.childNodes;
    if (children.length === 0) {
        if (text !== "") {
            el.textContent = textContent(el).slice(0, offset) + text + textContent(el).slice(offset);

        }
        return [offset, el];
    }
    var i = 0;
    var cur = 0;
    while (i < children.length && cur + textContent(children[i]).length < offset)
        cur+=textContent(children[i++]).length;
    return insertText(children[i], offset-cur, text);
};
const getElementAtOffset = (el, offset) => insertText(el, offset, ""); 

const highlight = function(timeout) {
    var toId = null;
    var firstTime = true;
    return function() {
        if (toId) clearTimeout(toId);
        toId = setTimeout(() => {
            toId = null;
            const res = hljs.highlightAuto(textarea.value);
            editorContainerDiv.setAttribute('lang', res.language || "");
            pre.innerHTML = res.value;
        }, firstTime? 0 : timeout);
        firstTime = false;
    }
}(300);

const oninput = function(e={isTrusted:true}) {
    if (!e.isTrusted) {
        handled = true;
        if (e.inputType === "insertText") {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.value = textarea.value.slice(0, start) + e.data + textarea.value.slice(end);
            textarea.selectionStart = textarea.selectionEnd = textarea.selectionDirection === "forward" ? start + e.data.length : start;
        }
    }
    if (e.inputType === "insertText") {
        insertText(pre, caretpre.children[0].textContent.length, e.data);
    } else if (e.inputType === "deleteContentBackward"){
        const [offset, el] = getElementAtOffset(pre, caretpre.children[0].textContent.length);
        if (offset > 0) {
            el.textContent = el.textContent.slice(0, offset-1) + el.textContent.slice(offset);
        } else if (el.previousSibling) {
            el.previousSibling.textContent = el.previousSibling.textContent.slice(0, -1);
        }
    } else if (e.inputType === "deleteContentForward"){
        const [offset, el] = getElementAtOffset(pre, caretpre.children[0].textContent.length);
        if (offset < el.textContent.length) {
            el.textContent = el.textContent.slice(0, offset) + el.textContent.slice(offset+1);
        } else if (el.nextSibling) {
            el.nextSibling.textContent = el.nextSibling.textContent.slice(1);
        }
    } else {
        pre.innerText = textarea.value;
    }
    highlight();
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
    span1.querySelectorAll('br').forEach(br => br.outerHTML = "\n");

    span2.innerText = pre.innerText.slice(offset);
    span2.querySelectorAll('br').forEach(br => br.outerHTML = "\n");

    spancaret.classList.add('caret');
    caretpre.innerHTML = "";
    caretpre.append(span1, spancaret, span2);
    updatelines();
};
textarea.addEventListener('input', oninput);
textarea.addEventListener('input', updatecaret);
textarea.addEventListener('click', updatecaret);
textarea.addEventListener('keydown', updatecaret);
textarea.addEventListener('keydown', e => {
    if(e.key === "Tab") {
        e.preventDefault()
        textarea.dispatchEvent(new InputEvent('input', {
            inputType: "insertText",
            data: "    ",
        }));
    };
    if(e.key === "Enter") {
        e.preventDefault()
        textarea.dispatchEvent(new InputEvent('input', {
            inputType: "insertText",
            data: "\n",
        }));
    };
});
textarea.addEventListener('keyup', updatecaret);
editorDiv.addEventListener('click', e => {
    editorDiv.classList.add("focused");
    e.stopPropagation();
});
window.addEventListener('click', () => editorDiv.classList.remove("focused"));
window.addEventListener('blur', () => editorDiv.classList.remove("focused"));
setTimeout(oninput);
setTimeout(updatecaret);
