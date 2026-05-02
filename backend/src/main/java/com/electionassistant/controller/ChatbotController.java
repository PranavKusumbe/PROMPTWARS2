package com.electionassistant.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> handleQuery(@RequestBody Map<String, String> request) {
        String userQuery = request.getOrDefault("query", "").toLowerCase();
        String responseText = processQuery(userQuery);
        
        Map<String, String> response = new HashMap<>();
        response.put("answer", responseText);
        return ResponseEntity.ok(response);
    }

    private String processQuery(String query) {
        if (query.contains("process") || query.contains("how")) {
            return "The election process generally includes voter registration, candidate nomination, campaigning, voting day, and the result declaration.";
        } else if (query.contains("candidate") || query.contains("who")) {
            return "Fetching candidate details from the database... Currently, this is a simulated response for demonstration.";
        } else if (query.contains("vote")) {
            return "To vote, you need to be registered and assigned to a constituency. On voting day, you select your preferred candidate.";
        } else {
            return "I can answer questions about the election process, candidates, and voting. Please ask me a specific question!";
        }
    }
}
