package com.architecture.microservices.domain.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "file_items")
data class FileItemEntity(
    @Id
    var id: String = "",

    @Column(nullable = false)
    var name: String = "",

    @Column(nullable = false)
    var type: String = "",

    @Column(nullable = false)
    var sizeInBytes: Long = 0L,

    @Column(nullable = false)
    var lastModified: String = "",

    var parentId: String? = null
)
