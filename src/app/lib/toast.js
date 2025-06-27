// src/lib/toast.js
class Toast {
  static show(message, type = "info", options = {}) {
    if (typeof window === "undefined") return;

    const toastId = options.id || Date.now().toString();
    const duration = options.duration || 3000;

    // Create toast element
    const toast = document.createElement("div");
    toast.id = `toast-${toastId}`;
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;

    // Style based on type
    const styles = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      info: "bg-blue-500 text-white",
      loading: "bg-gray-500 text-white",
    };

    toast.className += ` ${styles[type] || styles.info}`;
    toast.textContent = message;

    // Add to DOM
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove("translate-x-full");
    }, 10);

    // Auto remove (except for loading)
    if (type !== "loading") {
      setTimeout(() => {
        Toast.remove(toastId);
      }, duration);
    }

    return toastId;
  }

  static remove(toastId) {
    const toast = document.getElementById(`toast-${toastId}`);
    if (toast) {
      toast.classList.add("translate-x-full");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }
  }

  static success(message, options = {}) {
    return this.show(message, "success", options);
  }

  static error(message, options = {}) {
    return this.show(message, "error", options);
  }

  static loading(message, options = {}) {
    return this.show(message, "loading", options);
  }
}

// Global toast object - ADD THE REMOVE METHOD HERE
const toast = {
  success: (message, options) => Toast.success(message, options),
  error: (message, options) => Toast.error(message, options),
  loading: (message, options) => Toast.loading(message, options),
  remove: (toastId) => Toast.remove(toastId), // This was missing!
};

export default toast;