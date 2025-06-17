package com.example.note.mapper;

import com.example.note.entity.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {
    User selectById(Long id);
    User selectByUsername(String username);
    int insert(User user);
    int update(User user);
    int deleteById(Long id);
}