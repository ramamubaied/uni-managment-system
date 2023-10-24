-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 22, 2023 at 02:13 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `projectm`
--

-- --------------------------------------------------------

--
-- Table structure for table `checklist`
--

CREATE TABLE `checklist` (
  `id` int(200) NOT NULL,
  `task_id` int(200) NOT NULL,
  `checklist` text NOT NULL,
  `project_id` int(200) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `username` text NOT NULL,
  `projectname` text NOT NULL,
  `taskname` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `priority` varchar(255) NOT NULL,
  `reporting_frequency` enum('daily','weekly','fortnightly','monthly','specific_date') DEFAULT NULL,
  `report_format` text DEFAULT NULL,
  `specific_reporting_date` date DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `due_date` date NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `percentage` int(10) NOT NULL DEFAULT 0,
  `frequency` enum('daily','weekly','monthly','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_users`
--

CREATE TABLE `project_users` (
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `submission_date` date NOT NULL,
  `status` enum('submitted','pending','read','unread') DEFAULT NULL,
  `content` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `task_name` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `project_id` int(11) NOT NULL,
  `assigned_to` int(11) NOT NULL,
  `due_date` date NOT NULL,
  `description` text ,
  `checklist` text ,
  `status` enum('Complete','Incomplete','Approved','Disapprove') NOT NULL DEFAULT 'Incomplete',
  `feedback` text ,
  `response` text 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) ,
  `email` varchar(255) NOT NULL,
  `mobile_number` varchar(15) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('team_member','project_manager') NOT NULL,
  `profile_image` text ,
  `city` varchar(255) ,
  `gender` varchar(255) ,
  `country` varchar(255) ,
  `address` text 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_id`, `name`, `username`, `email`, `mobile_number`, `password_hash`, `role`, `profile_image`, `city`, `gender`, `country`, `address`) VALUES
(16, '4b495cbc00f13f9a82c6a2c7dd88d638', 'admin', '', 'admin@admin.com', '123654', '$2b$10$BrQO63XcILLrPJ3Mggq5D.bKi.v5UnRxG6rdHzAhjhhu8VUMvqoXq', 'project_manager', '41d374cfd2a85749b8980a73d9edbd10.png', '', 'undefined', '', ''),
(17, 'b58a3849e43eb0b6047c9038893aebd6', 'Frank', '', 'frank.johnson@gmail.com', '0756789012', '$2b$10$0vzZ6Dc3QH8H3qJw2WC9L.jEoQUq3sJ6MS8pooKQ9UG/8iOfn0DPu', 'team_member', '', '', '', '', ''),
(18, '0923edc968d80db4abda9c2559d30015', 'Grace', '', 'grace.davis@gmail.com', '0790123456', '$2b$10$pCR97n4fATDc0Gk4njRGGOi1F.xGDjRvWcA08.tCA027UKmq9qbHm', 'team_member', '', '', '', '', ''),
(19, 'bae691f3141182879fd63c40474e9336', 'Ivy', '', 'ivy.anderson@hotmail.com', '0789012345', '$2b$10$DuUCRzPksHpy94lk.N.se.j6gShcPWeuiQRkUAfDaTU4Ue7bFhVj.', 'team_member', '', '', '', '', ''),
(20, 'b97fda2f89ffbfbcad2216dc7efff4dc', 'Henry', '', 'henry.wilson@icloud.com', '0778901234', '$2b$10$o0NOAr.E6zs0dQ.lIePgvuLvEYzrioFoqBw4gejfco/hAQjR/XWJy', 'team_member', '', '', '', '', ''),
(21, 'd03e898118e0987a3f0a6a69f030994d', 'Emily', '', 'emily.brown@hotmail.com', '0767890123', '$2b$10$tE1gVKKkHVpgfFzaev8nNeZPAQYzNZUITtcWsinmkmtwJwPncE8pC', 'team_member', '', '', '', '', ''),
(22, '4aed8da5aa97ea5ecb9301a9f0ecf83e', 'Olivia', '', 'olivia.jones@hotmail.com', '0756789012', '$2b$10$KbDJmMrFnkwH0S/FC/uzGeN.DDBhl6f8bzlYVNPIcrGTd3YtZhj0a', 'team_member', '', '', '', '', ''),
(23, '56d13b4765ccec813d577c46556dc7e9', 'Nathan', '', 'nathan.smith@gmail.com', '0767890123', '$2b$10$5nWh75LGDls96oaK837FweFFpX1/.tK7XWv0b/TtTK1F0CetZZc9a', 'team_member', '', '', '', '', ''),
(24, '0c59d8c3a7a68bd72b94c46bff1e1fad', 'Megan', '', 'megan.anderson@hotmail.com', '0745678901', '$2b$10$9frLHDRQIybZhPZlg6RNnOqPjHXk7Mi3Bq2.zIJe3DDZ6xqVmzfWa', 'team_member', '', '', '', '', ''),
(25, '1566a51dee32edb381cf741576ad5527', 'Sam', '', 'sam.williams@gmail.com', '0789012345', '$2b$10$gK/Kr8t5gbFfD1YQn7I8COE/00rQ59.WU352cMsyOMZDn/mfCdA0K', 'project_manager', 'da6574c588acb43e51a23c802db8e10d.jpg', '', 'undefined', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `checklist`
--
ALTER TABLE `checklist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`projectname`(768)),
  ADD KEY `task_id` (`taskname`(768)),
  ADD KEY `user_id` (`username`(768));

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `project_users`
--
ALTER TABLE `project_users`
  ADD PRIMARY KEY (`project_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `assigned_to` (`assigned_to`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `checklist`
--
ALTER TABLE `checklist`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `project_users`
--
ALTER TABLE `project_users`
  ADD CONSTRAINT `project_users_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `project_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
