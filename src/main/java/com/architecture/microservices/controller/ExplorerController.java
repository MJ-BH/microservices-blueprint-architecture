package com.architecture.microservices.controller;

import com.architecture.microservices.core.response.ApiResponse;
import com.architecture.microservices.domain.model.FileItemEntity;
import com.architecture.microservices.domain.repository.FileItemRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/explorer")
public class ExplorerController {

    private final FileItemRepository fileItemRepository;

    public ExplorerController(FileItemRepository fileItemRepository) {
        this.fileItemRepository = fileItemRepository;
    }

    @PostConstruct
    public void initMockData() {
        if (fileItemRepository.count() == 0) {
            fileItemRepository.saveAll(List.of(
                new FileItemEntity("f1", "Documents", "folder", 0L, "2026-08-16T10:00:00Z", null),
                new FileItemEntity("f2", "Design_Tokens", "folder", 0L, "2026-08-15T14:30:00Z", null),
                new FileItemEntity("f3", "Clean_Architecture_Guide.pdf", "pdf", 3200000L, "2026-08-17T09:15:00Z", null),
                new FileItemEntity("f4", "VGV_Monorepo_Setup.doc", "document", 180000L, "2026-08-17T11:20:00Z", null),
                new FileItemEntity("f1_1", "Jetpack_Compose_v2.pdf", "pdf", 4500000L, "2026-08-18T01:00:00Z", "f1"),
                new FileItemEntity("f1_2", "Ktor_Auth_Interceptor.doc", "document", 220000L, "2026-08-18T01:10:00Z", "f1")
            ));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FileItemEntity>>> getItems(@RequestParam(required = false) String folderId) {
        List<FileItemEntity> items;
        if (folderId == null || folderId.trim().isEmpty() || "null".equalsIgnoreCase(folderId)) {
            items = fileItemRepository.findByParentIdIsNull();
        } else {
            items = fileItemRepository.findByParentId(folderId);
        }
        return ResponseEntity.ok(ApiResponse.success(items, "Explorer items fetched successfully"));
    }

    @PostMapping("/folders")
    public ResponseEntity<ApiResponse<FileItemEntity>> createFolder(@RequestBody Map<String, String> body) {
        String name = body.getOrDefault("name", "New Folder");
        String parentId = body.get("parentId");
        FileItemEntity folder = new FileItemEntity(
            "folder_" + System.currentTimeMillis(),
            name,
            "folder",
            0L,
            Instant.now().toString(),
            parentId
        );
        FileItemEntity saved = fileItemRepository.save(folder);
        return ResponseEntity.status(201).json(ApiResponse.success(saved, "Folder created successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable String id) {
        fileItemRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Item deleted successfully"));
    }
}
