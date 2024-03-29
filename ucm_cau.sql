-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-12-2022 a las 16:24:40
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ucm_cau`
--
CREATE OR REPLACE DATABASE `ucm_cau` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE `ucm_cau`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_cau_avi_avisos`
--

CREATE TABLE `ucm_aw_cau_avi_avisos` (
  `idAviso` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `texto` varchar(2000) COLLATE utf8mb4_spanish_ci NOT NULL,
  `fecha` datetime NOT NULL,
  `idTecnico` int(11) DEFAULT NULL,
  `perfil` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `tipo` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `categoria` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `subcategoria` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `comentario_tecnico` varchar(2000) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_cau_tec_tecnico`
--

CREATE TABLE `ucm_aw_cau_tec_tecnico` (
  `correo` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `num_empleado` varchar(8) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `ucm_aw_cau_tec_tecnico`
--

INSERT INTO `ucm_aw_cau_tec_tecnico` (`correo`, `num_empleado`) VALUES
('tecnico1@ucm.es', '1234-abc'),
('tecnico10@ucm.es', '3456-bcd'),
('tecnico2@ucm.es', '2345-abc'),
('tecnico3@ucm.es', '3456-abc'),
('tecnico4@ucm.es', '4567-abc'),
('tecnico5@ucm.es', '5678-abc'),
('tecnico6@ucm.es', '6789-abc'),
('tecnico7@ucm.es', '7890-abc'),
('tecnico8@ucm.es', '1234-bcd'),
('tecnico9@ucm.es', '2345-bcd');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_cau_usu_usuarios`
--

CREATE TABLE `ucm_aw_cau_usu_usuarios` (
  `idUsuario` int(11) NOT NULL,
  `correo` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombre` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `contraseña` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `fecha` datetime NOT NULL,
  `perfil` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `tecnico` tinyint(4) NOT NULL,
  `foto` longblob DEFAULT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ucm_aw_cau_avi_avisos`
--
ALTER TABLE `ucm_aw_cau_avi_avisos`
  ADD PRIMARY KEY (`idAviso`),
  ADD KEY `usuarioo` (`idUsuario`);

--
-- Indices de la tabla `ucm_aw_cau_tec_tecnico`
--
ALTER TABLE `ucm_aw_cau_tec_tecnico`
  ADD PRIMARY KEY (`correo`);

--
-- Indices de la tabla `ucm_aw_cau_usu_usuarios`
--
ALTER TABLE `ucm_aw_cau_usu_usuarios`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ucm_aw_cau_avi_avisos`
--
ALTER TABLE `ucm_aw_cau_avi_avisos`
  MODIFY `idAviso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_cau_usu_usuarios`
--
ALTER TABLE `ucm_aw_cau_usu_usuarios`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ucm_aw_cau_avi_avisos`
--
ALTER TABLE `ucm_aw_cau_avi_avisos`
  ADD CONSTRAINT `usuarioo` FOREIGN KEY (`idUsuario`) REFERENCES `ucm_aw_cau_usu_usuarios` (`idUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
