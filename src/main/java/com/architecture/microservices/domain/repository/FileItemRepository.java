package com.architecture.microservices.domain.repository;

import com.architecture.microservices.domain.model.FileItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileItemRepository extends JpaRepository<FileItemEntity, String> {
    List<FileItemEntity> findByParentId(String parentId);
    List<FileItemEntity> findByParentIdIsNull();
}
