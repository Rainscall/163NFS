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
    if (!fileInputPartText.className) {
        fileInputPartText.innerText = 'Select file';
    }
});

dropInZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadFile(e.dataTransfer.files);
    if (!fileInputPartText.className) {
        fileInputPartText.innerText = 'Select file';
    }
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

    if (!fileInput.files[0] && !fileIn) {
        return;
    }

    fileInputPartText.innerText = 'Uploading';
    fileInputPartText.className = 'fileInputPartTextUploading';

    let fileName = '';
    let fileSize = '';
    let fileEditTime = '';

    if (fileIn) {
        formData.append('file', fileIn[0]);
        selectedFile.innerText = 'uploading: ' + fileIn[0].name;
        fileName = fileIn[0].name;
        fileSize = fileIn[0].size;
        fileEditTime = fileIn[0].lastModifiedDate;
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
        fileName = fileInput.files[0].name;
        fileSize = fileInput.files[0].size;
        fileEditTime = fileInput.files[0].lastModifiedDate;
        if (isImageFile(fileInput.files[0])) {
            const reader = new FileReader();
            reader.readAsDataURL(fileInput.files[0]);
            reader.onload = () => {
                selectFile.style.backgroundImage = 'url(' + reader.result + ')';
            }
        }
    }

    let isLargeFile = false;
    if (fileSize > 30 * 1024 * 1024) {
        Toastify({
            text: "WARN: Uploaded files may not be previewed.",
            duration: 4500,
            className: "info",
            position: "center",
            gravity: "top",
            style: {
                color: "#000",
                background: "#efe40c",
                borderRadius: "8px",
                boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.217), 0 10px 36px -4px rgba(98, 98, 98, 0.171)"
            }
        }).showToast();
        isLargeFile = true;
    }

    if (fileSize > 700 * 1024) {
        fileSize = (fileSize / 1024 / 1024).toFixed(3) + 'MiB';
    } else {
        fileSize = (fileSize / 1024).toFixed(3) + 'KiB';
    }

    //getMonth从0开始，需要+1
    fileEditTime = fileEditTime.getFullYear() + '-' + (Number(fileEditTime.getMonth()) + 1) + '-' + fileEditTime.getDate();

    const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
    }).catch((error) => {
        Toastify({
            text: "Error: " + error,
            duration: 4500,
            className: "info",
            position: "center",
            gravity: "bottom",
            style: {
                background: "#840D23",
                borderRadius: "8px",
                boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.217), 0 10px 36px -4px rgba(98, 98, 98, 0.171)"
            }
        }).showToast();
        fileInputPartText.innerText = 'ERROR';
        fileInputPartText.className += ' fileInputPartTextError';
        selectedFile.innerText = error;
        return;
    });
    const data = await response.json();
    const resultUrl1 = document.getElementById('urlLink1');
    const resultUrl2 = document.getElementById('urlLink2');
    const resultOutput = document.getElementById('resultOutput');
    const fileInfo = document.getElementById('fileInfo');
    let fileInfoBlock = document.createElement('div');

    fileInfo.innerHTML = '';

    let fileNameBlock = document.createElement('p');
    fileNameBlock.innerHTML = 'Name: ' + '<span>' + fileName + '</span>';

    let fileSizeBlock = document.createElement('p');
    fileSizeBlock.innerHTML = 'Size: ' + '<span>' + fileSize + '</span>';

    let fileEditTimeBlock = document.createElement('p');
    fileEditTimeBlock.innerHTML = 'Last edit time: ' + '<span>' + fileEditTime + '</span>';

    fileInfoBlock.appendChild(fileNameBlock);
    fileInfoBlock.appendChild(fileSizeBlock);
    fileInfoBlock.appendChild(fileEditTimeBlock);

    fileInfo.appendChild(fileInfoBlock);

    let longLink = '';
    if (isLargeFile === true) {
        longLink = data.uploadUrl;
    } else {
        longLink = data.equivalentUrl;
    }

    let shortLink = '';
    await getShortLink(longLink).then((r) => {
        resultUrl1.innerText = longLink;
        resultUrl2.innerText = r;
        shortLink = r;
    })

    resultOutput.style.display = 'unset';
    selectedFile.innerText = 'waiting...';
    selectFile.style.backgroundImage = 'none';
    fileInputPartText.innerText = 'Select file';
    fileInputPartText.className = '';

    fileInput.files = void 0;

    const qrcodeImg = document.getElementById("qrcodeImg");
    qrcodeImg.src = generateQRCode(fileName.length < 32 ? longLink : shortLink, 150, 150);
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

function generateImageDataURL(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
}

document.body.onload = () => {
    const qrcodeImg = document.getElementById("qrcodeImg");
    qrcodeImg.src = generateImageDataURL(150, 150);
}

function generateQRCode(data, width, height) {
    // 创建一个新的QRCode实例
    var qrcode = new QRCode(document.createElement("div"), {
        text: data,
        width: width,
        colorDark: "#000",
        colorLight: "#ededed",
        correctLevel: QRCode.CorrectLevel.L,
        height: height
    });
    // 获取生成的二维码图片的data URL
    var dataURL = qrcode._el.firstChild.toDataURL("image/png");
    // 销毁QRCode实例，以释放资源
    qrcode._el.innerHTML = "";
    return dataURL;
}
