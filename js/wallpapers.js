const url = 'https://harveytucker.com/api/wallpapers/upload';
const fileUploadInput = document.getElementById('file-uploader');
const uploadBox = document.getElementById('upload-box');
const successMessage = document.getElementById('success-message');

function upload() {
    if (!fileUploadInput.files || fileUploadInput.files.length === 0) {
        return alert('Please select a file to upload.');
    }

    for (const image of fileUploadInput.files) {
        if (!image) {
            return alert('No file selected');
        }

        if (!(image.type.includes("image/jpeg") || image.type.includes("image/png"))) {
            return alert('Only png and jpg/jpeg files are allowed');
        }

        uploadBox.style.display = "none";
        successMessage.textContent = "Uploading...";
        successMessage.style.display = "block";

        const formData = new FormData();
        formData.append('image', image);

        fetch(url, {
            method: 'POST',
            body: formData
        }).then(res => res.json()).then(data => console.log(data)).then(() => uploadSuccess()).catch(error => console.error(error));
    }
}

function uploadSuccess() {
    fileUploadInput.value = "";
    uploadBox.style.display = "block";
    successMessage.textContent = "Upload Successful!";
}