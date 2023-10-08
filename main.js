// Boiler plate code to display editor and for save/load functionality
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
  const accessToken =
    "sl.BngIi5CzWAUQ8m041hSseJc2W8GzNjn7V9ZtZlwrjhyzX8h-mT5-p95GhTUnN2V6sjEV7GW7_z9yT1OjnZAIPSuLLnZhGBsHPdb7ECf82X-k7A9to5D-6J5otsbKNfy7EjhF-XRSRqZ5";

  // Save content to Dropbox
  document.getElementById("save-button").addEventListener("click", function () {
    // Some variables for adding on to existing functionality
    const bodySection = document.querySelector("body");
    const message = document.createElement("h2");
    // These are just the defualt variables from the company
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
          // --------My added on feature - Displaying a message when file is saved to dropbox------
          message.textContent = "File saved successfully!";
          message.style.textAlign = "center";
          message.style.color = "#fff";
          bodySection.append(message);
        } else {
          console.error("Error saving file to Dropbox:", response.statusText);
          // -------My added on feature - Displaying an error message if there is an error--------
          message.textContent = "Something went wrong ☹️";
          message.style.textAlign = "center";
          message.style.color = "#fff";
          bodySection.append(message);
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
  });

  // Function to save content
  function saveContent() {
    // Implement save logic here if needed
  }
});
