// Toast Notification Service - Unified Implementation
// This service overrides native alert() and confirm() to use toast messages

(function() {
    'use strict';
    
    // Create toast container if it doesn't exist
    function ensureToastContainer() {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    // Initialize container immediately
    if (document.body) {
        ensureToastContainer();
    } else {
        document.addEventListener('DOMContentLoaded', ensureToastContainer);
    }

    // Toast Notification Service
    window.ToastService = {
        show: function(message, type = 'info', duration = 3000) {
            const container = ensureToastContainer();
            if (!container) return;

            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            const icons = {
                success: '<i class="fas fa-check-circle"></i>',
                error: '<i class="fas fa-times-circle"></i>',
                warning: '<i class="fas fa-exclamation-triangle"></i>',
                info: '<i class="fas fa-info-circle"></i>'
            };

            const titles = {
                success: 'Success',
                error: 'Error',
                warning: 'Warning',
                info: 'Info'
            };

            toast.innerHTML = `
                <div class="toast-icon">${icons[type] || icons.info}</div>
                <div class="toast-content">
                    <div class="toast-title">${titles[type] || 'Info'}</div>
                    <div class="toast-message">${message}</div>
                </div>
                <button class="toast-close" aria-label="Close">&times;</button>
            `;

            container.appendChild(toast);

            // Close button functionality
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => {
                this.hide(toast);
            });

            // Auto-hide after duration (only for non-confirmation toasts)
            if (duration > 0 && !toast.hasAttribute('data-confirmation-toast')) {
                setTimeout(() => {
                    this.hide(toast);
                }, duration);
            }

            return toast;
        },

        hide: function(toast) {
            if (!toast) return;
            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 300);
        },

        success: function(message, duration = 3000) {
            return this.show(message, 'success', duration);
        },

        error: function(message, duration = 4000) {
            return this.show(message, 'error', duration);
        },

        warning: function(message, duration = 3000) {
            return this.show(message, 'warning', duration);
        },

        info: function(message, duration = 3000) {
            return this.show(message, 'info', duration);
        },

        // Confirmation dialog using toast-style with action buttons
        confirm: function(message, onConfirm, onCancel) {
            const container = ensureToastContainer();
            if (!container) {
                // Fallback: just execute confirm if container can't be created
                onConfirm && onConfirm();
                return;
            }

            // Create toast-style confirmation (doesn't auto-dismiss)
            const toast = document.createElement('div');
            toast.className = 'toast warning';
            toast.style.minWidth = '350px';
            toast.style.maxWidth = '450px';
            toast.setAttribute('data-confirmation-toast', 'true');
            
            toast.innerHTML = `
                <div class="toast-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="toast-content" style="flex: 1;">
                    <div class="toast-title">Confirm Action</div>
                    <div class="toast-message">${message}</div>
                    <div style="display: flex; gap: 10px; margin-top: 12px; justify-content: flex-end;">
                        <button data-action="cancel" type="button" style="padding: 6px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 12px; color: #333; font-weight: 500; transition: all 0.2s;">Cancel</button>
                        <button data-action="confirm" type="button" style="padding: 6px 16px; border: none; background: #d32f2f; color: white; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.2s;">Confirm</button>
                    </div>
                </div>
                <button class="toast-close" aria-label="Close" data-action="close" type="button">&times;</button>
            `;

            container.appendChild(toast);

            const removeToast = () => {
                toast.classList.add('hiding');
                setTimeout(() => {
                    if (toast.parentElement) {
                        toast.parentElement.removeChild(toast);
                    }
                }, 300);
            };

            // Event delegation for buttons
            const cancelBtn = toast.querySelector('[data-action="cancel"]');
            const okBtn = toast.querySelector('[data-action="confirm"]');
            const closeBtn = toast.querySelector('[data-action="close"]');

            // Confirm button
            okBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeToast();
                onConfirm && onConfirm();
            });

            // Cancel button
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeToast();
                onCancel && onCancel();
            });

            // Close button
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeToast();
                onCancel && onCancel();
            });

            // Add hover effects
            cancelBtn.addEventListener('mouseenter', function() {
                this.style.background = '#f5f5f5';
                this.style.borderColor = '#bbb';
            });
            cancelBtn.addEventListener('mouseleave', function() {
                this.style.background = 'white';
                this.style.borderColor = '#ddd';
            });
            okBtn.addEventListener('mouseenter', function() {
                this.style.background = '#c62828';
            });
            okBtn.addEventListener('mouseleave', function() {
                this.style.background = '#d32f2f';
            });

            return toast;
        }
    };

    // Override native alert() function - completely replace with toast
    const originalAlert = window.alert;
    window.alert = function(message) {
        if (window.ToastService && window.ToastService.show) {
            window.ToastService.info(String(message), 4000);
        } else {
            // Fallback: use console if ToastService not ready
            console.warn('Alert (toast not ready):', message);
            if (originalAlert) {
                originalAlert(message);
            }
        }
    };

    // Override native confirm() function - show toast confirmation
    // Note: This cannot be truly synchronous, so we show toast and return false
    // Code should use ToastService.confirm() for proper async handling
    const originalConfirm = window.confirm;
    window.confirm = function(message) {
        if (window.ToastService && window.ToastService.confirm) {
            // Show toast confirmation - return false by default
            // For proper handling, code should use ToastService.confirm() directly
            window.ToastService.confirm(
                String(message),
                () => {
                    // User confirmed - but we can't return this synchronously
                    console.log('User confirmed:', message);
                },
                () => {
                    // User cancelled
                    console.log('User cancelled:', message);
                }
            );
            // Return false as default (can't make it truly synchronous)
            return false;
        } else {
            // Fallback: use original confirm if ToastService not ready
            if (originalConfirm) {
                return originalConfirm(message);
            }
            return false;
        }
    };

})();
