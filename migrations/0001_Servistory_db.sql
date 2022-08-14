DROP TABLE IF EXISTS `Servistory`.`PushSubscription` ;

CREATE TABLE IF NOT EXISTS `Servistory`.`PushSubscription` (
  `id` VARCHAR(50) NOT NULL,
  `vendor_id` VARCHAR(50) NOT NULL,
  `subscription` TEXT NOT NULL,
  `date_time_created` DATETIME NOT NULL DEFAULT NOW(),
  `date_time_updated` DATETIME NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `subscription_vendor_id`
    FOREIGN KEY (`vendor_id`)
    REFERENCES `Servistory`.`Vendor` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `vendor_id_idx` ON `Servistory`.`PushSubscription` (`vendor_id` ASC);
