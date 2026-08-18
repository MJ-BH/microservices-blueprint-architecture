package com.architecture.microservices.controller;

import com.architecture.microservices.core.response.ApiResponse;
import com.architecture.microservices.domain.model.EventEntity;
import com.architecture.microservices.domain.repository.EventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventEntity>>> getAllEvents() {
        List<EventEntity> events = eventRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(events, "Events fetched successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventEntity>> createEvent(@RequestBody EventEntity event) {
        EventEntity saved = eventRepository.save(event);
        return ResponseEntity.ok(ApiResponse.success(saved, "Event created successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventEntity>> getEventById(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(event -> ResponseEntity.ok(ApiResponse.success(event, "Event found")))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Event deleted successfully"));
    }
}
