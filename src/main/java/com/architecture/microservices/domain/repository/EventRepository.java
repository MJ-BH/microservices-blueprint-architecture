package com.architecture.microservices.domain.repository;

import com.architecture.microservices.domain.model.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {
    List<EventEntity> findByLocationContainingIgnoreCase(String location);
}
