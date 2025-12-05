package com.rivereactnative

import android.util.Log

/**
 * Generic error handler for RiveReactNative errors.
 * Allows custom error handling logic to be injected at runtime.
 */
class RiveReactNativeErrorHandler {
  companion object {
    private const val TAG = "RiveReactNative"

    /**
     * Global error handler callback. Override this to provide custom error handling.
     * By default, logs errors to Logcat.
     */
    var onError: ((error: Throwable, context: String) -> Unit)? = null

    /**
     * Handles an error by invoking the custom handler or falling back to logging.
     *
     * @param error The throwable that occurred
     * @param context Description of where/what operation failed
     */
    fun handleError(error: Throwable, context: String) {
      val handler = onError
      if (handler != null) {
        try {
          handler(error, context)
        } catch (e: Throwable) {
          // If custom handler fails, fall back to logging
          android.util.Log.e(TAG, "Error in custom error handler for context: $context", e)
          android.util.Log.e(TAG, "Original error:", error)
        }
      } else {
        // Default: log to Logcat
        android.util.Log.e(TAG, "Error in $context", error)
      }
    }
  }
}
