package com.architecture.microservices.domain.repository

import com.architecture.microservices.domain.model.FileItemEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FileItemRepository : JpaRepository<FileItemEntity, String> {
    fun findByParentId(parentId: String?): List<FileItemEntity>
    fun findByParentIdIsNull(): List<FileItemEntity>
}
