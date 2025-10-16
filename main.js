const slider = document.querySelector('.slider');
const container = document.querySelector('.slider-container');

let scrollSpeed = 1; // pixels per frame (higher = faster)
let isPaused = false;

function autoScroll() {
    if (!isPaused) {
        slider.scrollLeft += scrollSpeed;

        // When the first image fully scrolls out of view
        const firstImg = slider.querySelector('img');
        if (slider.scrollLeft >= firstImg.clientWidth + 10) {
            // Move that image to the end
            slider.appendChild(firstImg);
            // Reset scroll position to avoid jumps
            slider.scrollLeft -= firstImg.clientWidth + 10;
        }
    }
    requestAnimationFrame(autoScroll);
}

// Start the auto-scroll
autoScroll();

// Pause on hover
container.addEventListener('mouseenter', () => isPaused = true);
container.addEventListener('mouseleave', () => isPaused = false);


async function handleSubmit(e, sheet) {
    e.preventDefault();
    const form = e.target; // The form element
    const name = form.name.value.trim(); // Assuming your input has name="name"
    const phone = form.phone.value.trim(); // Assuming your input has name="phone"
    // // Validate inputs
    if (!name || !phone) {
      showAlert("الرجاء إدخال الاسم ورقم الهاتف.", "warning");
      return;
    }
      const progressContainer = document.getElementById("preloader");
    progressContainer.classList.remove("d-none");
    // Show progress bar
  
    try {
      const response = await fetch('./submit-sheet.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: name,
          phone: phone,
          compound: sheet
        })
      });
  
      const result = await response.json();
      if (result.success) {
        name.value = "";
        phone.value = "";
          window.location.href = './thank-you.html';
          
  
      } else {
        throw new Error(result.error || "Submission failed");
      preloader.classList.add('hidden');
  
  
      }
    } catch (error) {
      console.error("Error:", error);
      preloader.classList.add('hidden');
  
      showAlert("حدث خطأ، برجاء المحاولة مرة أخرى.", "danger");
    } finally {
    }
  }

  function showAlert(message, type) {
    const alertContainer = document.getElementById("alertContainer");
  
    // Clear any existing alerts
    while (alertContainer.firstChild) {
      alertContainer.firstChild.remove();
    }
  
    if (!message || !type) return;
  
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade`;
    alertDiv.role = "alert";
    alertDiv.innerHTML = `
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      ${message}
    `;
  
    alertContainer.appendChild(alertDiv);
  
    // Trigger reflow to enable transition
    void alertDiv.offsetWidth;
  
    // Trigger fade-in
    alertDiv.classList.add("show");
  
    // Auto-close after 10 seconds
    const AUTO_CLOSE_DELAY = 10000;
    // This runs AFTER the fade-out animation completes
    if (type === "success") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setTimeout(() => {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alertDiv);
      bsAlert.close(); // Starts fade-out
    }, AUTO_CLOSE_DELAY);
  
    // ✅ Listen for when Bootstrap finishes removing the alert
  
  }
  