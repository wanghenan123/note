/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 80041 (8.0.41)
 Source Host           : localhost:3306
 Source Schema         : note

 Target Server Type    : MySQL
 Target Server Version : 80041 (8.0.41)
 File Encoding         : 65001

 Date: 23/02/2025 17:15:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '内容',
  `category_id` bigint NOT NULL COMMENT '分类ID',
  `author_id` bigint NOT NULL COMMENT '作者ID',
  `view_count` int NULL DEFAULT 0 COMMENT '浏览量',
  `like_count` int NULL DEFAULT 0 COMMENT '点赞数',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：0-草稿，1-已发布',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category`(`category_id` ASC) USING BTREE,
  INDEX `idx_author`(`author_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '文章表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES (23, '雪', '今年的第一场雪，瑞雪兆丰年', 1, 1, 7, 1, 1, '2025-01-24 17:27:48', '2025-01-24 18:34:27');
INSERT INTO `article` VALUES (24, '废弃文章', '废弃文章如何处理', 4, 1, 1, 0, 0, '2025-01-24 17:29:12', '2025-01-24 18:35:00');
INSERT INTO `article` VALUES (25, '用户发表', '这是合法的', 4, 2, 0, 0, 0, '2025-01-24 17:29:58', '2025-01-24 17:29:58');
INSERT INTO `article` VALUES (26, '这是yh1的文章', '我的第一篇', 1, 2, 4, 7, 0, '2025-01-24 17:30:20', '2025-02-07 20:40:27');
INSERT INTO `article` VALUES (27, '555', '222111', 4, 1, 13, 7, 1, '2025-01-24 19:02:20', '2025-02-23 17:13:20');
INSERT INTO `article` VALUES (28, 'yh1', 'yh1的文章', 4, 2, 0, 0, 1, '2025-02-23 16:50:07', '2025-02-23 16:50:07');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类名称',
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '分类描述',
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '文章分类表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, '新闻', '新闻系列', 0, '2025-01-23 21:22:32', '2025-01-23 21:22:32');
INSERT INTO `category` VALUES (4, '广告', '宣传系列', NULL, '2025-01-24 17:27:18', '2025-01-24 17:27:18');

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `article_id` bigint NOT NULL COMMENT '文章ID',
  `user_id` bigint NOT NULL COMMENT '评论用户ID',
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '评论内容',
  `parent_id` bigint NULL DEFAULT NULL COMMENT '父评论ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_article`(`article_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '评论表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES (2, 22, 1, '34234234', NULL, '2025-01-24 16:24:50');
INSERT INTO `comment` VALUES (3, 22, 1, '你是什么', NULL, '2025-01-24 16:27:52');
INSERT INTO `comment` VALUES (4, 22, 2, 'asdad', NULL, '2025-01-24 16:28:30');
INSERT INTO `comment` VALUES (5, 22, 2, 'dddddd', NULL, '2025-01-24 16:28:41');
INSERT INTO `comment` VALUES (6, 22, 2, '年后', NULL, '2025-01-24 17:09:16');
INSERT INTO `comment` VALUES (7, 17, 2, '年后', NULL, '2025-01-24 17:09:27');
INSERT INTO `comment` VALUES (8, 23, 2, '真棒', NULL, '2025-01-24 17:30:46');
INSERT INTO `comment` VALUES (9, 23, 1, '谢谢你', NULL, '2025-01-24 17:31:44');
INSERT INTO `comment` VALUES (10, 27, 1, '555', NULL, '2025-01-24 19:02:49');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像URL',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'ADMIN', 'admin', '123', '小中', NULL, NULL, NULL, '2025-01-23 18:30:12', '2025-02-23 16:13:27');
INSERT INTO `user` VALUES (2, 'USER', 'yh1', '123456', '小七', NULL, '1111@qq.com', '11111111', '2025-01-23 19:11:15', '2025-01-23 21:22:41');
INSERT INTO `user` VALUES (3, NULL, 'yh2', '123', 'www', NULL, '273996@qq.com', '123123', '2025-02-23 16:15:42', '2025-02-23 16:15:42');

SET FOREIGN_KEY_CHECKS = 1;
