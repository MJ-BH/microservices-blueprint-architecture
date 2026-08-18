package com.architecture.microservices.domain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "file_items")
public class FileItemEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // folder, document, pdf, image

    @Column(nullable = false)
    private Long sizeInBytes;

    @Column(nullable = false)
    private String lastModified;

    private String parentId;

    public FileItemEntity() {}

    public FileItemEntity(String id, String name, String type, Long sizeInBytes, String lastModified, String parentId) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.sizeInBytes = sizeInBytes;
        this.lastModified = lastModified;
        this.parentId = parentId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getSizeInBytes() { return sizeInBytes; }
    public void setSizeInBytes(Long sizeInBytes) { this.sizeInBytes = sizeInBytes; }

    public String getLastModified() { return lastModified; }
    public void setLastModified(String lastModified) { this.lastModified = lastModified; }

    public String getParentId() { return parentId; }
    public void setParentId(String parentId) { this.parentId = parentId; }
}
