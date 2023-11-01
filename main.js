const uploadEndpoint = "https://163nfs--labs.cyberrain.dev/upload"
const getShortLinkEndpoint = 'https://163nfs--labs.cyberrain.dev/getShortURL'

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

    // await getShortLink(data.uploadUrl).then((r) => {
    //     resultUrl1.innerText = r;
    // })

    await getShortLink(data.equivalentUrl).then((r) => {
        resultUrl1.innerText = data.equivalentUrl;
        resultUrl2.innerText = r;
    })

    resultOutput.style.display = 'unset';
    selectedFile.innerText = 'waiting...';

    fileInput.value = '';
}

function selectFile() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
}

function copyTextToClipboard(element) {
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

async function getShortLink(longLink) {
    try {
        longLink = encodeURIComponent(longLink);
        const response = await fetch(getShortLinkEndpoint + "?url=" + longLink);
        const data = response.text();
        const result = data;
        return result;
    } catch (error) {
        console.error("Error: " + error);
        return null;
    }
}
