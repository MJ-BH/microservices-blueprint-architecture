package com.architecture.microservices.core.response

import java.time.LocalDateTime

data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T?,
    val timestamp: LocalDateTime = LocalDateTime.now()
) {
    companion object {
        fun <T> success(data: T, message: String): ApiResponse<T> {
            return ApiResponse(success = true, message = message, data = data)
        }

        fun <T> error(message: String): ApiResponse<T> {
            return ApiResponse(success = false, message = message, data = null)
        }
    }
}
