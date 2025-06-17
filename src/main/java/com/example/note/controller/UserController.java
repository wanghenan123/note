package com.example.note.controller;

import com.example.note.common.Result;
import com.example.note.entity.User;
import com.example.note.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public Result<User> getUser(@PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @GetMapping("/username/{username}")
    public Result<User> getUserByUsername(@PathVariable String username) {
        return Result.success(userService.getByUsername(username));
    }

    @PostMapping("/register")
    public Result<User> register(@RequestBody User user) {
        user.setRole("USER");  // 注册用户默认为普通用户
        userService.save(user);
        return Result.success(user);
    }

    @PutMapping("/{id}")
    public Result<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        userService.update(user);
        return Result.success(user);
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return Result.success(null);
    }

    @PostMapping("/login")
    public Result<User> login(@RequestBody Map<String, String> loginForm) {
        String username = loginForm.get("username");
        String password = loginForm.get("password");
        User user = userService.getByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return Result.success(user);
        }
        return Result.error("用户名或密码错误");
    }
}