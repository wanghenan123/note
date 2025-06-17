package com.example.note.mapper;

import com.example.note.entity.Category;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CategoryMapper {
    Category selectById(Long id);
    List<Category> selectList();
    int insert(Category category);
    int update(Category category);
    int deleteById(Long id);
}
