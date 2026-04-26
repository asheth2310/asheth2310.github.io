package com.asheth.userservice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final Map<String, User> users = new HashMap<>();

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        user.setId(UUID.randomUUID().toString());
        users.put(user.getId(), user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        User user = users.get(id);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<Collection<User>> listUsers() {
        return ResponseEntity.ok(users.values());
    }
}
