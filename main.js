const uploadEndpoint = "https://163nfs--labs.cyberrain.dev/upload"
const getShortLinkEndpoint = 'https://163nfs--labs.cyberrain.dev/getShortURL'
const dropInZone = document.getElementById('basePart');
const fileInputPartText = document.getElementById('fileInputPartText');

dropInZone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    fileInputPartText.innerText = 'Release to upload';
});

dropInZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileInputPartText.innerText = 'Release to upload';
});

dropInZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    fileInputPartText.innerText = 'Select file';
});

dropInZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadFile(e.dataTransfer.files);
    fileInputPartText.innerText = 'Select file';
});

document.addEventListener('paste', function (event) {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    // 检查粘贴的数据是否包含文件
    if (clipboardData && clipboardData.files.length > 0) {
        uploadFile(clipboardData.files);
    } else {
        return;
    }
});

function isImageFile(file) {
    const mime = file.type;
    return mime.startsWith("image/");
}

async function uploadFile(fileIn) {
    const fileInput = document.getElementById('fileInput');
    const selectedFile = document.getElementById('selectedFile');
    const selectFile = document.getElementById('selectFile');

    const formData = new FormData();

    if (fileIn) {
        formData.append('file', fileIn[0]);
        selectedFile.innerText = 'uploading: ' + fileIn[0].name;
        if (isImageFile(fileIn[0])) {
            const reader = new FileReader();
            reader.readAsDataURL(fileIn[0]);
            reader.onload = () => {
                selectFile.style.backgroundImage = 'url(' + reader.result + ')';
            }
        }
    } else {
        formData.append('file', fileInput.files[0]);
        selectedFile.innerText = 'uploading: ' + fileInput.files[0].name;
        if (isImageFile(fileInput.files[0])) {
            const reader = new FileReader();
            reader.readAsDataURL(fileInput.files[0]);
            reader.onload = () => {
                selectFile.style.backgroundImage = 'url(' + reader.result + ')';
            }
        }
    }

    const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
    }).catch((error) => {
        console.log(error);
        selectedFile.innerText = 'FAILED';
        return;
    });
    const data = await response.json();
    const resultUrl1 = document.getElementById('urlLink1');
    const resultUrl2 = document.getElementById('urlLink2');
    const resultOutput = document.getElementById('resultOutput');

    await getShortLink(data.equivalentUrl).then((r) => {
        resultUrl1.innerText = data.equivalentUrl;
        resultUrl2.innerText = r;
    })

    resultOutput.style.display = 'unset';
    selectedFile.innerText = 'waiting...';
    selectFile.style.backgroundImage = 'none';

    fileInput.files = void 0;

    const qrcodeImg = document.getElementById("qrcodeImg");
    qrcodeImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(data.equivalentUrl);
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
