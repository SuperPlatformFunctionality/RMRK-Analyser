-- drop database if exists initial_world_nft;
create database initial_world_nft default character set utf8mb4 collate utf8mb4_unicode_ci;

use initial_world_nft;

CREATE TABLE `base` (
    `id` varchar(48) NOT NULL,
    `issuer` varchar(48) NOT NULL,
    `symbol` varchar(48) NOT NULL,
    `type` varchar(16) NOT NULL,
    `block` int(11) unsigned NOT NULL,
    -- parts are in table base_part
    -- themes are in table ???
    -- changes are in table ???
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY `pk_id`(`id`) USING HASH,
    INDEX `idx_issuer`(`issuer`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `base_part` (
    `base_id` varchar(48) NOT NULL, -- need a foreigner key?
    `id` varchar(48) NOT NULL,
    `type` varchar(16) NOT NULL,
    `src` varchar(255) NOT NULL DEFAULT '',
    `themable` tinyint(1) NOT NULL DEFAULT '0',
    `z` int(11) NOT NULL DEFAULT '0',
    -- equippable list is in table base_part_equippable
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- base id 和 id 组成主键
    PRIMARY KEY `pk_base_id_id`(`base_id`,`id`) USING HASH,
    INDEX `idx_base_id`(`base_id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `base_part_equippable` (
    `base_id` varchar(48) NOT NULL,
    `part_id` varchar(48) NOT NULL,
    `collection_id` varchar(48) NOT NULL,
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY `pk_base_id_part_id`(`base_id`,`part_id`) USING HASH,
    INDEX `pk_base_id`(`base_id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
