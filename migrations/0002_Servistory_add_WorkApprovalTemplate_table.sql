DROP TABLE IF EXISTS `Servistory`.`WorkApprovalTemplate` ;

CREATE TABLE IF NOT EXISTS `Servistory`.`WorkApprovalTemplate` (
  `id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `reason` TEXT NULL,
  `date_time_created` DATETIME NOT NULL DEFAULT NOW(),
  `date_time_updated` DATETIME NULL,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;