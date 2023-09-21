document.addEventListener("DOMContentLoaded", function () {
    // Initialize TinyMCE
    tinymce.init({
        selector: "textarea#editor",
        height: 500,
        plugins: "save",
        toolbar: "save",
        save_enablewhendirty: true,
        save_onsavecallback: saveContent,
    });

    // Dropbox access token
    const accessToken = "sl.BmYKPCf-y8q6vw88AjF5MvXcJyJ45GSyAf3Zga4ueqNrzYlN9oipw6fwqLAzGeWpffDqULgGASeV0s7d0K18PK6VTtT5GmRilrGIN9ngmwykF4rVApPMzhPxQwrXiGJpyIyn9VcdvwcZ";

    // Save content to Dropbox
document.getElementById("save-button").addEventListener("click", function () {
    const content = tinymce.activeEditor.getContent();
    const blob = new Blob([content], { type: "text/html" });
    const file = new File([blob], "document.html");

    const formData = new FormData();
    formData.append("file", file);

    fetch("https://content.dropboxapi.com/2/files/upload", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Dropbox-API-Arg": JSON.stringify({
                path: "/document.html",
                mode: "overwrite",
            }),
            "Content-Type": "application/octet-stream",
        },
        body: file,
    })
        .then((response) => {
            if (response.ok) {
                console.log("File saved to Dropbox successfully.");
            } else {
                console.error("Error saving file to Dropbox:", response.statusText);
            }
        })
        .catch((error) => {
            console.error("Error saving file to Dropbox:", error);
        });
});

    // Load content from Dropbox
document.getElementById("load-button").addEventListener("click", function () {
    fetch("https://content.dropboxapi.com/2/files/download", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Dropbox-API-Arg": JSON.stringify({
                path: "/document.html",
            }),
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                console.error("Error loading file from Dropbox:", response.statusText);
            }
        })
        .then((content) => {
            tinymce.activeEditor.setContent(content);
        })
        .catch((error) => {
            console.error("Error loading file from Dropbox:", error);
        });
});

    // Function to save content
    function saveContent() {
        // Implement save logic here if needed
    }
});
