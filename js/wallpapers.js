const url = 'https://harveytucker.com/api/wallpapers/upload';

function upload() {
    const fileUploadInput = document.getElementById('file-uploader');

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

        const formData = new FormData();
        formData.append('image', image);

        fetch(url, {
            method: 'POST',
            body: formData
        }).then(res => res.json()).then(data => console.log(data)).catch(error => console.error(error));
    }
}