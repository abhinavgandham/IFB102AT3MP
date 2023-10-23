document.addEventListener("DOMContentLoaded", function () {
  // Initialize TinyMCE
  tinymce.init({
    selector: "textarea#editor",
    height: 400,
    plugins:
      "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion",
    menubar: "file edit view insert format tools table help",
    toolbar:
      "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
    autosave_ask_before_unload: true,
    autosave_interval: "30s",
    autosave_restore_when_empty: false,
    autosave_retention: "2m",
    image_advtab: true,
    image_caption: true,
    quickbars_selection_toolbar:
      "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
    toolbar_mode: "sliding",
    contextmenu: "link image table",
  });

  // Save content to Dropbox
  document.getElementById("save-button").addEventListener("click", function () {
    // Some variables for adding on to existing functionality
    const bodySection = document.querySelector("body");
    const message = document.createElement("h2");
    // These are just the defualt variables from the company
    const content = tinymce.activeEditor.getContent();
    const blob = new Blob([content], { type: "text/html" });
    const file = new File([blob], "document.html");
    const refreshButton = document.getElementById("refreshButton");
    const filenameInput = document.getElementById("filenameInput");
    const inputValue = filenameInput.value.trim();
    const timestamp = new Date().toLocaleString().replace(/[^0-9]/g, "");

    const filename = inputValue ? inputValue : `document${timestamp}`;

    const formData = new FormData();
    formData.append("file", file);
    fetch("/api/access-token")
      .then((response) => response.json())
      .then((data) => {
        let accessToken = data.accessToken;

        // Now you can use the accessToken in your client-side code
        fetch("https://content.dropboxapi.com/2/files/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Dropbox-API-Arg": JSON.stringify({
              // path: "/htmls/${filename}.html",
              path: `/htmls/${filename}.html`, // Use backticks to interpolate filename
              mode: "add",
            }),
            "Content-Type": "application/octet-stream",
          },
          body: file,
        })
          .then((response) => {
            if (response.ok) {
              console.log("File saved to Dropbox successfully.");
              alert("File saved to Dropbox successfully.");
              filenameInput.value = "";
            } else {
              console.error(
                "Error saving file to Dropbox:",
                response.statusText
              );
              alert(
                "Error saving file to Dropbox - Check Console For Error Status"
              );
            }
          })
          .catch((error) => {
            console.error("Error saving file to Dropbox:", error);
            alert(
              "Error saving file to Dropbox - Check Console For Error Status"
            );
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  // Load content from Dropbox
  document.getElementById("load-button").addEventListener("click", function () {
    const selectElement = document.getElementById("fileList");
    const selectedValue = selectElement.value;
    fetch("/api/access-token")
      .then((response) => response.json())
      .then((data) => {
        let accessToken = data.accessToken;
        // Now you can use the accessToken in your client-side code
        fetch("https://content.dropboxapi.com/2/files/download", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Dropbox-API-Arg": JSON.stringify({
              // path: "/htmls",
              path: `/htmls/${selectedValue}`, // Use backticks to interpolate filename
            }),
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.text();
            } else {
              console.error(
                "Error loading file from Dropbox:",
                response.statusText
              );
            }
          })
          .then((content) => {
            tinymce.activeEditor.setContent(content);
          })
          .catch((error) => {
            console.error("Error loading file from Dropbox:", error);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  // Function to list files from the "htmls" folder on Dropbox
  function listFilesFromDropbox() {
    fetch("/api/access-token")
      .then((response) => response.json())
      .then((data) => {
        let accessToken = data.accessToken;
        fetch("https://api.dropboxapi.com/2/files/list_folder", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: "/htmls",
          }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              console.error(
                "Error listing files from Dropbox:",
                response.statusText
              );
            }
          })
          .then((data) => {
            // Assuming that data.entries is an array of file objects
            const fileNames = data.entries;
            populateFileList(fileNames);
          })
          .catch((error) => {
            console.error("Error listing files from Dropbox:", error);
          });
        // Now you can use the accessToken in your client-side code
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  // Function to populate the select element with options
  function populateFileList(fileNames) {
    const selectElement = document.getElementById("fileList");

    // Clear existing options
    selectElement.innerHTML = "";

    // Populate options based on the file names from Dropbox
    fileNames.forEach((fileName) => {
      const option = document.createElement("option");
      option.value = fileName.name;
      option.text = fileName.name;
      selectElement.appendChild(option);
    });
  }

  // Attach the click event listener to the button
  document
    .getElementById("refreshButton")
    .addEventListener("click", listFilesFromDropbox);

  // Initial file list population
  listFilesFromDropbox();
  // Function to save content
  function saveContent() {
    // Implement save logic here if needed
  }
});
