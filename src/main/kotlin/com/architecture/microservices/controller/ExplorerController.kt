package com.architecture.microservices.controller

import com.architecture.microservices.core.response.ApiResponse
import com.architecture.microservices.domain.model.FileItemEntity
import com.architecture.microservices.domain.repository.FileItemRepository
import jakarta.annotation.PostConstruct
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant

@RestController
@RequestMapping("/api/v1/explorer")
class ExplorerController(
    private val fileItemRepository: FileItemRepository
) {

    @PostConstruct
    fun initMockData() {
        if (fileItemRepository.count() == 0L) {
            fileItemRepository.saveAll(
                listOf(
                    FileItemEntity("f1", "Documents", "folder", 0L, "2026-08-16T10:00:00Z", null),
                    FileItemEntity("f2", "Design_Tokens", "folder", 0L, "2026-08-15T14:30:00Z", null),
                    FileItemEntity("f3", "Clean_Architecture_Guide.pdf", "pdf", 3200000L, "2026-08-17T09:15:00Z", null),
                    FileItemEntity("f4", "VGV_Monorepo_Setup.doc", "document", 180000L, "2026-08-17T11:20:00Z", null),
                    FileItemEntity("f1_1", "Jetpack_Compose_v2.pdf", "pdf", 4500000L, "2026-08-18T01:00:00Z", "f1"),
                    FileItemEntity("f1_2", "Ktor_Auth_Interceptor.doc", "document", 220000L, "2026-08-18T01:10:00Z", "f1")
                )
            )
        }
    }

    @GetMapping
    suspend fun getItems(@RequestParam(required = false) folderId: String?): ResponseEntity<ApiResponse<List<FileItemEntity>>> {
        val items = if (folderId.isNull_or_empty_or_null_string(folderId)) {
            fileItemRepository.findByParentIdIsNull()
        } else {
            fileItemRepository.findByParentId(folderId)
        }
        return ResponseEntity.ok(ApiResponse.success(items, "Explorer items fetched successfully"))
    }

    @PostMapping("/folders")
    suspend fun createFolder(@RequestBody body: Map<String, String>): ResponseEntity<ApiResponse<FileItemEntity>> {
        String name = body["name"] ?: "New Folder"
        val parentId = body["parentId"]
        val folder = FileItemEntity(
            id = "folder_${System.currentTimeMillis()}",
            name = name,
            type = "folder",
            sizeInBytes = 0L,
            lastModified = Instant.now().toString(),
            parentId = parentId
        )
        val saved = fileItemRepository.save(folder)
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved, "Folder created successfully"))
    }

    @DeleteMapping("/{id}")
    suspend fun deleteItem(@PathVariable id: String): ResponseEntity<ApiResponse<Nothing>> {
        fileItemRepository.deleteById(id)
        return ResponseEntity.ok(ApiResponse.success(null, "Item deleted successfully"))
    }

    private fun String?.isNull_or_empty_or_null_string(str: String?): Boolean {
        return str == null || str.trim().isEmpty() || "null".equals(str, ignoreCase = true)
    }
}
