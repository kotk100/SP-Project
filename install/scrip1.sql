DROP TABLE `wakemeup`.`verifyregistration`;

ALTER TABLE `wakemeup`.`users` 
ADD COLUMN `Verified` TINYINT(1) NOT NULL AFTER `Email`,
DROP INDEX `UserName_UNIQUE` ,
ADD UNIQUE INDEX `UserName_UNIQUE` (`UserName` ASC, `Verified` ASC),
DROP INDEX `Email` ,
ADD INDEX `Email` (`Email` ASC, `Verified` ASC);

CREATE TABLE `wakemeup`.`verification` (
  `idUser` INT NOT NULL,
  `verificationcode` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idUser`),
  CONSTRAINT `fk_user`
    FOREIGN KEY (`idUser`)
    REFERENCES `wakemeup`.`users` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

ALTER TABLE `wakemeup`.`lectures` 
    CHANGE COLUMN `EndTime` `Duration` INT(2) NOT NULL ;

    
ALTER TABLE `wakemeup`.`timetable`
    DROP FOREIGN KEY `TimeTable-Lecture`;

ALTER TABLE `wakemeup`.`lectures` 
CHANGE COLUMN `idLecture` `idLecture` INT(11) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `wakemeup`.`timetable`
    ADD CONSTRAINT `TimeTable-Lecture`
    FOREIGN KEY (`idLecture`)
    REFERENCES `wakemeup`.`Lectures` (`idLecture`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
    
    
ALTER TABLE `wakemeup`.`lectures`
    DROP FOREIGN KEY `Lecture-Lecturer`;

ALTER TABLE `wakemeup`.`lecturer` 
CHANGE COLUMN `idLecturer` `idLecturer` INT(11) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `wakemeup`.`lectures`
    ADD CONSTRAINT `Lecture-Lecturer`
    FOREIGN KEY (`idLecturer`)
    REFERENCES `wakemeup`.`Lecturer` (`idLecturer`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
    
ALTER TABLE `wakemeup`.`subjects` 
ADD INDEX `SEC` (`SubjectName` ASC);

ALTER TABLE `wakemeup`.`subjects` 
ADD COLUMN `SubjectNameLong` VARCHAR(80) NOT NULL AFTER `SubjectName`;

ALTER TABLE `wakemeup`.`users` 
ADD UNIQUE INDEX `Email_UNIQUE` (`Email` ASC);

ALTER TABLE `wakemeup`.`users` 
ADD UNIQUE INDEX `UserNameOnly_UNIQUE` (`UserName` ASC);

ALTER TABLE `wakemeup`.`timetable` 
DROP PRIMARY KEY,
ADD PRIMARY KEY (`idUser`, `idLecture`);

ALTER TABLE `wakemeup`.`timetable` 
ADD COLUMN `idLectureExchange` INT(11) NULL AFTER `idLecture`;

ALTER TABLE `wakemeup`.`settings` 
CHANGE COLUMN `CarSelected` `CarSelected` TINYINT(1) NULL DEFAULT NULL ,
CHANGE COLUMN `BusSelected` `BusSelected` TINYINT(1) NULL DEFAULT NULL ,
CHANGE COLUMN `BicycleSelected` `BicycleSelected` TINYINT(1) NULL DEFAULT NULL ,
CHANGE COLUMN `PedSelected` `PedSelected` TINYINT(1) NULL DEFAULT NULL ,
CHANGE COLUMN `Address` `Address` VARCHAR(45) NULL DEFAULT NULL ,
CHANGE COLUMN `PreparationTime` `PreparationTime` DOUBLE NULL DEFAULT NULL ;






