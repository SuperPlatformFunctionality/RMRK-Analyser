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

-- item is base.parts[i]
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
    PRIMARY KEY `pk_base_id_id`(`base_id`,`id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- item is base.parts[i].equippable[j], and base.parts[i] must be slot part
CREATE TABLE `base_part_equippable` (
    `base_id` varchar(48) NOT NULL,
    `part_id` varchar(48) NOT NULL,
    `collection_id` varchar(48) NOT NULL,
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY `pk_base_id_part_id_coll_id`(`base_id`,`part_id`,`collection_id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `collection` (
    `id` varchar(96) NOT NULL,
    `issuer` varchar(48) NOT NULL,
    `symbol` varchar(48) NOT NULL,
    `max` int(11) unsigned NOT NULL DEFAULT '0',
    `metadata` varchar(255) NOT NULL DEFAULT '',
    `block` int(11) unsigned NOT NULL,
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY `pk_id`(`id`) USING HASH,
    INDEX `idx_issuer`(`issuer`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `nft` (
    `id` varchar(128) NOT NULL,
    `block` int(10) unsigned NOT NULL,
    `collection` varchar(48) NOT NULL,
    `symbol` varchar(48) NOT NULL,
    `sn`    varchar(8) NOT NULL,
    `owner` varchar(48) NOT NULL,
    --  resources
    --	priority
    --	children
    --	logic
    `metadata` varchar(255) NOT NULL DEFAULT '',
    `transferable` int(10) NOT NULL DEFAULT '1',
    `pending` tinyint(4) NOT NULL DEFAULT '0',
    `forsale` int(10) NOT NULL DEFAULT '0',
    `burned` int(10) NOT NULL DEFAULT '0',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY `pk_id`(`id`) USING HASH,
    INDEX `idx_collection`(`collection`) USING HASH,
    INDEX `idx_owner`(`owner`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- items is nft.resources[i]
CREATE TABLE `nft_resource` (
    `nft_id` varchar(128) NOT NULL,
    `id` varchar(128) NOT NULL,

    `base` varchar(48) DEFAULT NULL,
    -- parts

    `src` varchar(255) DEFAULT NULL,
    `metadata` varchar(255) DEFAULT NULL,
    `slot` varchar(64) DEFAULT NULL,

    `thumb` varchar(255) DEFAULT NULL,
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY `pk_nft_id_res_id`(`nft_id`,`id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- item is nft.resources[i].parts[j], and nft.resource[i] must be a base, not a media or others
CREATE TABLE `nft_resource_base_part` (
    `nft_id` varchar(48) NOT NULL,
    `resource_id` varchar(48) NOT NULL,
    `part_id` varchar(48) NOT NULL,
    PRIMARY KEY `pk_nft_res_id_part_id`(`nft_id`,`resource_id`,`part_id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- item is nft.priority[i]
CREATE TABLE `nft_priority` (
    `nft_id` varchar(128) NOT NULL,
    `resource_id` varchar(48) NOT NULL,
    `order` int(10) NOT NULL,
    PRIMARY KEY `pk_nft_id_res_id`(`nft_id`, `resource_id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- item is nft.children[i]
CREATE TABLE `nft_child` (
    `nft_id` varchar(128) NOT NULL,
    `id` varchar(128) NOT NULL,
    `pending` tinyint(1) NOT NULL DEFAULT '0',
    `equipped` varchar(48) NOT NULL DEFAULT '',
    PRIMARY KEY `pk_nft_id_child_id`(`nft_id`, `id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- invalid call
CREATE TABLE `invalid_call` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `op_type` varchar(16) NOT NULL,
    `block` int(11) unsigned NOT NULL DEFAULT '0',
    `caller` varchar(48) NOT NULL,
    `object_id` varchar(512) DEFAULT NULL,
    `message` varchar(512) DEFAULT NULL,
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY `pk_id`(`id`) USING BTREE,
    INDEX `idx_caller`(`caller`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

