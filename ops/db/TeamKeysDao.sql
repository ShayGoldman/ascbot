CREATE TABLE `teams_aws_keys` (
  `team_id` varchar(50) NOT NULL DEFAULT '',
  `access_key_id` varchar(50) NOT NULL DEFAULT '',
  `secret_access_key` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`team_id`)
);