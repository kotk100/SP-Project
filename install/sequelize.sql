CREATE TABLE IF NOT EXISTS `lecturer` (`idLecturer` INTEGER(11) NOT NULL auto_increment , `LecturerName` VARCHAR(255), PRIMARY KEY (`idLecturer`)) ENGINE=InnoDB;
SHOW INDEX FROM `lecturer` FROM `wakemeup`
CREATE TABLE IF NOT EXISTS `subjects` (`idSubject` INTEGER(11) NOT NULL , `SubjectName` VARCHAR(255) NOT NULL, `SubjectNameLong` VARCHAR(255) NOT NULL, PRIMARY KEY (`idSubject`)) ENGINE=InnoDB;
SHOW INDEX FROM `subjects` FROM `wakemeup`
CREATE TABLE IF NOT EXISTS `lectures` (`idLecture` INTEGER(11) NOT NULL auto_increment , `idSubject` INTEGER(11) NOT NULL, `StartTime` TIME NOT NULL, `Duration` INTEGER(2) NOT NULL, `Day` INTEGER(11) NOT NULL, `Location` VARCHAR(255), `Practical` INTEGER(1) NOT NULL, `idLecturer` INTEGER(11) NOT NULL, PRIMARY KEY (`idLecture`), FOREIGN KEY (`idSubject`) REFERENCES `subjects` (`idSubject`) ON DELETE NO ACTION ON UPDATE CASCADE, FOREIGN KEY (`idLecturer`) REFERENCES `lecturer` (`idLecturer`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;
SHOW INDEX FROM `lectures` FROM `wakemeup`
CREATE TABLE IF NOT EXISTS `users` (`idUser` INTEGER(11) NOT NULL auto_increment , `UserName` VARCHAR(45) NOT NULL, `Password` VARCHAR(60) NOT NULL, `Email` VARCHAR(45) NOT NULL, `Verified` TINYINT(1) NOT NULL, UNIQUE `uniqueUserId` (`idUser`), UNIQUE `uniqueUsername` (`UserName`, `Email`), PRIMARY KEY (`idUser`)) ENGINE=InnoDB;
SHOW INDEX FROM `users` FROM `wakemeup`
CREATE TABLE IF NOT EXISTS `settings` (`idUser` INTEGER(11) NOT NULL , `CarSelected` INTEGER(1), `BusSelected` INTEGER(1), `BicycleSelected` INTEGER(1), `PedSelected` INTEGER(1), `Address` VARCHAR(255), `PreparationTime` DOUBLE, `StudentId` INTEGER(11), `Weather` INTEGER(1), PRIMARY KEY (`idUser`), FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;
SHOW INDEX FROM `settings` FROM `wakemeup`
CREATE TABLE IF NOT EXISTS `timetable` (`idUser` INTEGER(11) NOT NULL , `idLecture` INTEGER(11) NOT NULL , `idLectureExchange` INTEGER(11), PRIMARY KEY (`idUser`, `idLecture`), FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE NO ACTION ON UPDATE CASCADE, FOREIGN KEY (`idLecture`) REFERENCES `lectures` (`idLecture`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;
SHOW INDEX FROM `timetable` FROM `wakemeup`
CREATE TABLE IF NOT EXISTS `verification` (`idUser` INTEGER(11) NOT NULL , `verificationcode` VARCHAR(255) NOT NULL, PRIMARY KEY (`idUser`), FOREIGN KEY (`idUser`) REFERENCES `User` (`idUser`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE=InnoDB;
SHOW INDEX FROM `verification` FROM `wakemeup`
