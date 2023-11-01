const uploadEndpoint = "https://163nfs--labs.cyberrain.dev/upload"

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const selectedFile = document.getElementById('selectedFile');
    selectedFile.innerText = 'uploading:' + fileInput.files[0].name;
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    const resultUrl1 = document.getElementById('urlLink1');
    const resultUrl2 = document.getElementById('urlLink2');
    const resultOutput = document.getElementById('resultOutput');

    resultUrl1.href = data.uploadUrl;
    resultUrl1.textContent = data.uploadUrl;

    resultUrl2.href = data.equivalentUrl;
    resultUrl2.textContent = data.equivalentUrl;

    resultOutput.style.display = 'unset';
    selectedFile.innerText = 'waiting...';
}

function selectFile() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
}

function copyTextToClipboard(element) {
    console.log(element.children[0]);
    var textElement = element.children[0];
    var textArea = document.createElement("textarea");
    textArea.value = textElement.innerText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    Toastify({
        text: "copied.",
        duration: 1200,
        className: "info",
        position: "center",
        gravity: "bottom",
        style: {
            background: "#414141",
            borderRadius: "8px",
            boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.217), 0 10px 36px -4px rgba(98, 98, 98, 0.171)"
        }
    }).showToast();
}